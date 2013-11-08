#pragma once

#include "component.h"
#include "buffer.h"

#include "ppapi/cpp/url_loader.h"
#include "ppapi/cpp/url_request_info.h"
#include "ppapi/cpp/url_response_info.h"
#include "ppapi/cpp/completion_callback.h"
#include "ppapi/utility/completion_callback_factory.h"

class CroissantDecoder;

class CroissantDownloader: public CroissantComponent {
public:
	CroissantDownloader(CroissantInstance *instance, CroissantDecoder *decoder);

	void init();

	void download(const std::string &url);
	void onOpen(int32_t result);
	void read();
	void onRead(int32_t result);
	void output(const uint8_t * buffer, int32_t length);

	void token(const std::string &token);

private:
	CroissantDecoder *decoder_;

	std::string token_;

	pp::URLRequestInfo url_request_;
	pp::URLLoader url_loader_;

	pp::CompletionCallbackFactory<CroissantDownloader> cc_factory_;

	static const int READ_BUFFER_SIZE = 20480;
	uint8_t buffer_[READ_BUFFER_SIZE];
};
