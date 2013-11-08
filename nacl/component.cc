#include "component.h"
#include "croissant.h"

CroissantComponent::CroissantComponent(CroissantInstance *instance) : instance_(instance) {

}

void CroissantComponent::log  (const std::string &message) {	instance()->log  (message);	}
void CroissantComponent::trace(const std::string &message) {	instance()->trace(message);	}
void CroissantComponent::debug(const std::string &message) {	instance()->debug(message);	}
void CroissantComponent::info (const std::string &message) {	instance()->info (message);	}
void CroissantComponent::warn (const std::string &message) {	instance()->warn (message);	}
void CroissantComponent::error(const std::string &message) {	instance()->error(message);	}
void CroissantComponent::alert(const std::string &message) {	instance()->alert(message);	}
