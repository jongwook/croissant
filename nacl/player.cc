#include "player.h"
#include "buffer.h"


namespace {
	buffer<uint16_t> samples;
}

CroissantPlayer::CroissantPlayer(CroissantInstance *instance) : CroissantComponent(instance) {
	debug("CroissantPlayer constructed");
}


void CroissantPlayer::init() {

}

void CroissantPlayer::play() {

}

void CroissantPlayer::pause() {

}

void CroissantPlayer::clear() {

}


void CroissantPlayer::callback(void* samples, uint32_t buffer_size, void* data) {

}