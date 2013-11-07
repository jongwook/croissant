#include "downloader.h"
#include "croissant.h"

CroissantDownloader::CroissantDownloader(CroissantInstance *instance):
	CroissantComponent(instance),
	url_request_(instance),
	url_loader_(instance),
	cc_factory_(this)
{

}

void CroissantDownloader::CroissantDownloader::init() {

}

void CroissantDownloader::download(const std::string &url) {
	info("Downloading stream from " + url);

	url_request_.SetURL(url);
	url_request_.SetMethod("GET");
	url_request_.SetRecordDownloadProgress(true);

}

void CroissantDownloader::token(const std::string &token) {
	token_ = token;

	info("Set download token to " + token);
}
