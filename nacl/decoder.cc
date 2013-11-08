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

namespace {
	const uint32_t AUDIO_INBUF_SIZE = 20480u;
    const uint32_t AUDIO_REFILL_THRESH = 4096u;

	AVCodec *codec = NULL;
	AVCodecContext *context = NULL;
}

CroissantDecoder::CroissantDecoder(CroissantInstance *instance, CroissantPlayer *player) :
	CroissantComponent(instance),
	player_(player)
{
	av_register_all();
	log("av_register_all() called");
}

CroissantDecoder::~CroissantDecoder() {
	if (context) {
		avcodec_close(context);
		av_free(context);
	}
}

void CroissantDecoder::init() {
	codec = avcodec_find_decoder(AV_CODEC_ID_MP3);

	if (!codec) {
		error("Could not find MP3 codec");
		return;
	}

	context = avcodec_alloc_context3(codec);

	if (avcodec_open2(context, codec, NULL) < 0) {
		error("could not open codec");
		return;
	}
}

void CroissantDecoder::reset() {

}

void CroissantDecoder::append(const uint8_t * buffer, int32_t length, bool finalize) {
	static std::vector<uint8_t> cache;

	buffer_.append(std::vector<uint8_t>(buffer, buffer + length));

	uint8_t inbuf[AUDIO_INBUF_SIZE];

	memcpy(inbuf, cache.data(), cache.size());
	uint32_t filled = cache.size();
	cache.clear();

	while (true) {
		std::vector<uint8_t> incoming = buffer_.pop(AUDIO_INBUF_SIZE - filled);

		memcpy(inbuf + filled, incoming.data(), incoming.size());
		filled += incoming.size();

		if (finalize) {
			memset(inbuf + filled, 0, AUDIO_INBUF_SIZE - filled);
		} else if (filled < AUDIO_INBUF_SIZE) {
			cache = std::vector<uint8_t>(inbuf, inbuf + filled);
			debug("postponed decoding because there was only " + to_string(filled) + " bytes available");
			break;
		}

		AVPacket packet;
		av_init_packet(&packet);

		

		filled = 0;
		if (finalize) break;
	}


}