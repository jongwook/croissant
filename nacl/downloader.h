#pragma once

#include "component.h"
#include "buffer.h"

#include "ppapi/cpp/url_loader.h"
#include "ppapi/cpp/url_request_info.h"
#include "ppapi/cpp/completion_callback.h"
#include "ppapi/utility/completion_callback_factory.h"

class CroissantDownloader: public CroissantComponent {
public:
	CroissantDownloader(CroissantInstance *instance);

	void init();

	void download(const std::string &url);

	void token(const std::string &token);

private:
	buffer<uint8_t> buffer_;
	std::string token_;

	pp::URLRequestInfo url_request_;
	pp::URLLoader url_loader_;

	pp::CompletionCallbackFactory<CroissantDownloader> cc_factory_;

};
