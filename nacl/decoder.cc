#include "decoder.h"
#include "util.h"

extern "C" {
	#include <libavcodec/avcodec.h>
	#include <libavutil/channel_layout.h>
	#include <libavutil/common.h>
	#include <libavutil/imgutils.h>
	#include <libavutil/mathematics.h>
	#include <libavutil/samplefmt.h>
	#include <libavformat/avformat.h>
	#include <libavutil/dict.h>
}

CroissantDecoder::CroissantDecoder(CroissantInstance *instance, CroissantPlayer *player) :
	CroissantComponent(instance),
	player_(player)
{
}

void CroissantDecoder::init() {
	av_register_all();
	log("av_register_all()");
}

void CroissantDecoder::append(const char * buffer, int32_t length) {
	log("appended " + to_string(length) + " bytes to decoder");
}