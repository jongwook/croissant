#pragma once

#include "component.h"
#include "player.h"
#include "buffer.h"

class CroissantDecoder: public CroissantComponent {
public:
	CroissantDecoder(CroissantInstance *instance, CroissantPlayer *player);

	void init();

	void append(const char * buffer, int32_t length);

private:
	CroissantPlayer *player_;
	buffer<uint8_t> buffer_;
};
