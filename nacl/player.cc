#include "player.h"
#include "util.h"

#include "croissant.h"

namespace {
	const uint32_t SAMPLE_FRAME_COUNT = 4096u;
	const uint32_t CHANNELS = 2u;

	void forward(void* samples, uint32_t buffer_size, void* data) {
		CroissantPlayer *player = reinterpret_cast<CroissantPlayer *>(data);
		player->playback(samples, buffer_size);
	}
}

CroissantPlayer::CroissantPlayer(CroissantInstance *instance) : CroissantComponent(instance) {
	debug("CroissantPlayer constructed");
}

void CroissantPlayer::append(int16_t *buffer, size_t length) {
	debug("Appending " + to_string(length) + " samples to the audio buffer");
}

void CroissantPlayer::playback(void* samples, uint32_t buffer_size) {

}

void CroissantPlayer::init() {
	pp::AudioConfig audio_config = pp::AudioConfig(instance(), PP_AUDIOSAMPLERATE_44100, SAMPLE_FRAME_COUNT);

	audio_ = pp::Audio(instance(), audio_config, forward, this);
	bool success = audio_.StartPlayback();

	if (!success) {
		error("audio playback could not start");
	}
}

void CroissantPlayer::play() {

}

void CroissantPlayer::pause() {

}

void CroissantPlayer::clear() {

}

