#pragma once

#include "component.h"

class CroissantDecoder: public CroissantComponent {
public:
	CroissantDecoder(CroissantInstance *instance);

	void init();
};
