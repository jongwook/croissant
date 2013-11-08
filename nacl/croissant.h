#pragma once

#include "ppapi/cpp/instance.h"
#include "ppapi/cpp/module.h"
#include "ppapi/cpp/var_dictionary.h"

#include "decoder.h"
#include "downloader.h"
#include "player.h"

class CroissantModule : public pp::Module {
public:
	CroissantModule() : pp::Module() {}
	virtual ~CroissantModule() {}

	virtual pp::Instance* CreateInstance(PP_Instance instance);
};

class CroissantInstance : public pp::Instance {
public:
	explicit CroissantInstance(PP_Instance instance);
	virtual ~CroissantInstance();

	// initialize components
	virtual bool Init(uint32_t argc, const char* argn[], const char* argv[]);

	// receives messages from browser
	virtual void HandleMessage(const pp::Var& var_message);

	// dispatch message to handlers
	void dispatch(const std::string &opcode);
	void dispatch(const std::string &opcode, const std::string &operand);

	// handlers
	void token(const std::string &token);
	void load(const std::string &url);

	// post a message to browser, in {opcode: operand} format
	void post(const std::string &opcode, const std::string &message);

	// simple opcode-only messages to browser
	void log  (const std::string &message) {	post("log"  , message);	}
	void trace(const std::string &message) {	post("trace", message);	}
	void debug(const std::string &message) {	post("debug", message);	}
	void info (const std::string &message) {	post("info" , message);	}
	void warn (const std::string &message) {	post("warn" , message);	}
	void error(const std::string &message) {	post("error", message);	}
	void alert(const std::string &message) {	post("alert", message);	}

private:
	CroissantPlayer player_;
	CroissantDecoder decoder_;
	CroissantDownloader downloader_;
};

typedef void (CroissantInstance::*CROISSANT_HANDLER)(const std::string &operand);
