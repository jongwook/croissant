
#include "decoder.h"
#include "util.h"
#include "mpg123.h"

#include <memory>

#define AUDIO_INBUF_SIZE	204800
#define AUDIO_OUTBUF_SIZE	204800
#define AUDIO_REFILL_THRESH	4096

namespace {
	std::shared_ptr<mpg123_handle> m((mpg123_handle*)NULL);

	bool initialized = false;
	mpg123_id3v1 *v1;
	mpg123_id3v2 *v2;
}

CroissantDecoder::CroissantDecoder(CroissantInstance *instance, CroissantPlayer *player) :
	CroissantComponent(instance),
	player_(player)
{

}

CroissantDecoder::~CroissantDecoder() {
	mpg123_exit();
}

void CroissantDecoder::init() {
	mpg123_init();

}

void CroissantDecoder::reset() {
	m = std::shared_ptr<mpg123_handle>(mpg123_new(NULL, NULL), mpg123_delete);
}

int bytes = 0;
int total = 0;

bool CroissantDecoder::append(const uint8_t * buffer, int32_t length, bool finalize) {
	static std::vector<uint8_t> cache;

	buffer_.append(buffer, length);

	uint8_t inbuf[AUDIO_INBUF_SIZE];

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
		// TODO: use up inbuf

		if (!initialized) {
			m = std::shared_ptr<mpg123_handle>(mpg123_new(NULL, NULL), mpg123_delete);
			if (!m.get()) {
				error("could not create mpg123 handle");
				return false;
			}
			int ret = mpg123_open_feed(m.get());
			if (ret == MPG123_ERR) {
				error("could not open mpg123 feed : " + to_string(ret));
				return false;
			}
			info("mpg123 initialized successfully");
			initialized = true;
		}

		uint8_t outbuf[AUDIO_OUTBUF_SIZE];
		size_t done = -1;
		int ret = MPG123_OK;
		ret = mpg123_decode(m.get(), inbuf, filled, outbuf, AUDIO_OUTBUF_SIZE, &done);
		//debug("[1]mpg123_decode returned : " + to_string(ret) + " and done = " + to_string(done));

		if (done > 0) {
			player_->append((int16_t*)outbuf, done/2);
		}

		while (ret != MPG123_NEED_MORE && ret != MPG123_ERR) {
			ret = mpg123_decode(m.get(), NULL, 0, outbuf, AUDIO_OUTBUF_SIZE, &done);
			//debug("[2]mpg123_decode returned : " + to_string(ret) + " and done = " + to_string(done));
			if (done > 0) {
				player_->append((int16_t*)outbuf, done/2);
			}
		}

		filled = 0;
		if (finalize) {
			break;
		}
	}

	return true;
}