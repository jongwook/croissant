#include "decoder.h"

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

CroissantDecoder::CroissantDecoder(CroissantInstance *instance) : CroissantComponent(instance) {}

void CroissantDecoder::init() {
	av_register_all();
	log("av_register_all()");
}