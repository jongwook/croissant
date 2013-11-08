#include "downloader.h"
#include "croissant.h"
#include "util.h"
#include "decoder.h"

CroissantDownloader::CroissantDownloader(CroissantInstance *instance, CroissantDecoder *decoder):
	CroissantComponent(instance),
	decoder_(decoder),
	cc_factory_(this)
{

}

void CroissantDownloader::CroissantDownloader::init() {
	info("CroissantDownloader initialized");
}

void CroissantDownloader::download(const std::string &url) {
	info("Downloading stream from " + url);

	url_request_ = pp::URLRequestInfo(instance());
	url_request_.SetURL(url);
	url_request_.SetMethod("GET");
	url_request_.SetRecordDownloadProgress(true);

	pp::CompletionCallback cc = cc_factory_.NewCallback(&CroissantDownloader::onOpen);

	url_loader_.Close();
	url_loader_ = pp::URLLoader(instance());
	url_loader_.Open(url_request_, cc);

	info("Url request opened");
}

void CroissantDownloader::onOpen(int32_t result) {
	if (result != PP_OK) {
		error("UrlLoader::Open failed : result = " + to_string(result));
		return;
	}

	pp::URLResponseInfo response = url_loader_.GetResponseInfo();
	int32_t status = response.GetStatusCode();

	info("HTTP response code : " + to_string(status));

	if (status / 100 != 2) {
		error("Request not successful; aborting download");
		url_loader_.Close();
		return;
	}

	int64_t bytes_received = 0;
	int64_t total_bytes_to_be_received = 0;
	if (url_loader_.GetDownloadProgress(&bytes_received, &total_bytes_to_be_received)) {
		if (total_bytes_to_be_received > 0) {
			info("total bytes to be received : " + to_string(total_bytes_to_be_received));
		}
	}
	// We will not use the download progress anymore, so just disable it.
	url_request_.SetRecordDownloadProgress(false);

	// Start streaming.
	decoder_->reset();
	read();
}

void CroissantDownloader::read() {
	pp::CompletionCallback cc = cc_factory_.NewOptionalCallback(&CroissantDownloader::onRead);
	int32_t result = PP_OK;

	do {
		result = url_loader_.ReadResponseBody(buffer_, READ_BUFFER_SIZE, cc);

		if (result > 0) {
			output(buffer_, result);
		}
	} while (result > 0);

	if (result != PP_OK_COMPLETIONPENDING) {
		cc.Run(result);
	}

}

void CroissantDownloader::onRead(int32_t result) {
	if (result == PP_OK) {
		log("Downloading complete");
		decoder_->append(buffer_, 0, true);
	} else if (result > 0) {
		output(buffer_, result);
		read();
	} else {
		error("Downloading error : code = " + to_string(result));
	}
}

void CroissantDownloader::output(const uint8_t * buffer, int32_t length) {
	decoder_->append(buffer, length);
}

void CroissantDownloader::token(const std::string &token) {
	token_ = token;

	info("Set download token to " + token);
}
