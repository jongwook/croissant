#pragma once

#include "ppapi/cpp/audio.h"

#include "component.h"

class CroissantPlayer: public CroissantComponent {
public:
	CroissantPlayer(CroissantInstance *instance);

	void init();

	// unpause the audio
	void play();

	// pause the audio
	void pause();

	// clear any queued samples for a new song
	void clear();


private:

	// supplies audio samples to the device
	static void callback(void* samples, uint32_t buffer_size, void* data);

	// the audio
	pp::Audio audio_;
};
