#pragma once

#include "component.h"
#include "player.h"
#include "buffer.h"

class CroissantDecoder: public CroissantComponent {
public:
	CroissantDecoder(CroissantInstance *instance, CroissantPlayer *player);
	virtual ~CroissantDecoder();

	void init();

	void reset();
	bool append(const uint8_t * buffer, int32_t length, bool finalize = false);


private:
	CroissantPlayer *player_;
	buffer<uint8_t> buffer_;

};
