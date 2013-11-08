#pragma once

#include "ppapi/cpp/audio.h"
#include "ppapi/cpp/audio_config.h"

#include "component.h"
#include "buffer.h"

class CroissantPlayer: public CroissantComponent {
public:
	CroissantPlayer(CroissantInstance *instance);

	void init();

	// append audio samples to be played
	void append(int16_t *buffer, size_t length);

	// unpause the audio
	void play();

	// pause the audio
	void pause();

	// clear any queued samples for a new song
	void clear();

	// supplies audio samples to the device
	void playback(void* samples, uint32_t buffer_size);

private:
	// stored audio samples
	buffer<uint16_t> samples;

	// the audio
	pp::Audio audio_;
};
