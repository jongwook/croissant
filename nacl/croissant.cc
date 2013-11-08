
#include "croissant.h"
#include "util.h"

// the entry point: return a CroissantModule
namespace pp {
	Module* CreateModule() {
		return new CroissantModule();
	}
}

// for global debug logging
CroissantInstance* g_instance = NULL;

void croissant_log(const std::string& message) {
	if (g_instance) {
		g_instance->log(message);
	}
}

// the only role of CroissantModule: returns a new CroissantInstance
pp::Instance* CroissantModule::CreateInstance(PP_Instance instance) {
	return new CroissantInstance(instance);
}


namespace {
	std::map<std::string, CROISSANT_HANDLER> handlers;
}

CroissantInstance::CroissantInstance(PP_Instance instance) :
	pp::Instance(instance),
	player_(this),
	decoder_(this, &player_),
	downloader_(this, &decoder_)
{
	debug("CroissantInstance constructed");
	g_instance = this;
}

CroissantInstance::~CroissantInstance() {
	debug("CroissantInstance destroyed");
}

bool CroissantInstance::Init(uint32_t argc, const char* argn[], const char* argv[]) {
	debug("Initializing CroissantInstance ...");

	// the routing table
	handlers["token"] = &CroissantInstance::token;
	handlers["load"] = &CroissantInstance::load;

	downloader_.init();
	decoder_.init();
	player_.init();

	return true;
}

void CroissantInstance::HandleMessage(const pp::Var& var_message) {
	debug("Handling : " + var_message.DebugString());

	if (var_message.is_string()) {
		std::string message = var_message.AsString();
		dispatch(message);
	} else if (var_message.is_dictionary()) {
		pp::VarDictionary var_dict(var_message);
		pp::VarArray var_keys = var_dict.GetKeys();
		uint32_t length = var_keys.GetLength();
		for (size_t i = 0; i < length; i++) {
			pp::Var var_opcode = var_keys.Get(i);
			pp::Var var_operand = var_dict.Get(var_opcode);

			if (!var_opcode.is_string() || !var_operand.is_string()) {
				error("Either opcode or operand is not string; skipping");
				continue;
			}

			std::string opcode = var_opcode.AsString();
			std::string operand = var_operand.AsString();
			dispatch(opcode, operand);
		}
	} else {
		warn("Message is neither a string nor a dictionary");
	}
}

void CroissantInstance::dispatch(const std::string &opcode) {
	dispatch(opcode, "");
}

void CroissantInstance::dispatch(const std::string &opcode, const std::string &operand) {
	debug("Dispatching message " + opcode + " : " + operand);

	if (handlers.count(opcode) == 0) {
		warn("Handler for opcode " + opcode + "not found; skipping");
		return;
	}

	CROISSANT_HANDLER handler = handlers[opcode];
	(this->*handler)(operand);

	debug("Dispatched message " + opcode);
}

void CroissantInstance::token(const std::string &token) {
	downloader_.token(token);
}

void CroissantInstance::load(const std::string &url) {
	debug("loading : " + url);
	downloader_.download(url);
}

void CroissantInstance::post(const std::string &opcode, const std::string &message) {
	pp::VarDictionary var_message;
	var_message.Set(pp::Var(opcode), pp::Var(message));
	PostMessage(var_message);
}
