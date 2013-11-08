#pragma once

#include <queue>
#include <vector>

#include "util.h"

template<typename T>
class buffer {
public:
	buffer() : pos_(0), length_(0) {}

	void append(std::vector<T>&& data) {
		length_ += data.size();
		buffer_.push(std::move(data));
	}

	void append(const T* buffer, uint32_t length) {
		length_ += length;
		buffer_.emplace(buffer, buffer + length);
	}

	void clear() {
		std::queue<std::vector<T>>().swap(buffer_);
	}

	uint32_t size() {
		return buffer_.size();
	}

	uint32_t length() {
		return length_;
	}

	std::vector<T> pop(uint32_t length) {
		std::vector<T> result(length);
		uint32_t filled = 0;

		while (!buffer_.empty() && buffer_.front().size() <= length - filled) {
			// copy whole chunk
			std::vector<T> &front = buffer_.front();
			memcpy(result.data() + filled, front.data(), front.size() * sizeof(T));
			filled += front.size();
			length_ -= front.size();
			buffer_.pop();
		}

		if (!buffer_.empty() && buffer_.front().size() > length - filled) {
			uint32_t remaining = length - filled;

			std::vector<T> &front = buffer_.front();
			memcpy(result.data() + filled, front.data(), remaining * sizeof(T));
			filled += remaining;

			buffer_.front() = std::vector<T>(front.data() + remaining, front.data() + front.size());

			length_ -= remaining;
		}

		result.resize(filled);

		return result;
	}

	T next() {
		if (buffer_.empty()) return T();

		if (pos_ >= buffer_.front().size()) {
			length_ -= buffer_.front().size();
			buffer_.pop();
			pos_ = 0;
		}
		return buffer_.front()[pos_++];
	}

private:
	size_t pos_;
	size_t length_;
	std::queue<std::vector<T>> buffer_;

};
