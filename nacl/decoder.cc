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

#define AUDIO_INBUF_SIZE	20480
#define AUDIO_REFILL_THRESH	4096

namespace {
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

bool CroissantDecoder::append(const uint8_t * buffer, int32_t length, bool finalize) {
	static std::vector<uint8_t> cache;

	buffer_.append(std::vector<uint8_t>(buffer, buffer + length));

	uint8_t inbuf[AUDIO_INBUF_SIZE + FF_INPUT_BUFFER_PADDING_SIZE];

	memcpy(inbuf, cache.data(), cache.size());
	uint32_t filled = cache.size();
	cache.clear();

	while (true) {
		std::vector<uint8_t> incoming = buffer_.pop(AUDIO_INBUF_SIZE - filled);

		memcpy(inbuf + filled, incoming.data(), incoming.size());
		filled += incoming.size();

		if (!finalize && filled < AUDIO_INBUF_SIZE) {
			// save the partial data to cache
			cache = std::vector<uint8_t>(inbuf, inbuf + filled);

			// postpone processing until we have enough data
			return true;
		}

		// we have either full AUDIO_INBUF_SIZE buffer or the last buffer

		

		AVPacket packet;
		av_init_packet(&packet);

		packet.data = inbuf;
		packet.size = filled;

		AVFrame *frame = NULL;

		while (packet.size > AUDIO_REFILL_THRESH) {
			if (!frame) {
				if (!(frame = avcodec_alloc_frame())) {
					error("out of memory: could not allocate frame");
					return false;
				}
			} else {
				avcodec_get_frame_defaults(frame);
			}

			int got_frame = 0;
			int len = avcodec_decode_audio4(context, frame, &got_frame, &packet);
			if (len < 0) {
				error("Error while decoding : " + to_string(len));
				return false;
			}
			info("Not an error while decoding");

			if (got_frame) {
				int data_size = av_samples_get_buffer_size(NULL, context->channels, frame->nb_samples, context->sample_fmt, 1);
				info("Extracted " + to_string(frame->nb_samples) + " samples");
			}
			packet.size -= len;
			packet.data += len;
		}

		memmove(inbuf, packet.data, packet.size);
		filled = packet.size;
		if (finalize) break;
	}

	return true;
}