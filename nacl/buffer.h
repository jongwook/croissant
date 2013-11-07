#include <queue>
#include <vector>

template<typename T>
class buffer {
public:
	buffer() : pos(0) {}

	void append(std::vector<T>& data) {
		buffer_.push(data);
	}

	std::vector<T> pop() {
		std::vector<T> result = std::move(buffer_.front());
		buffer_.pop();
		return buffer_;
	}

	T next() {
		if (buffer_.empty()) return T();

		if (pos >= buffer_.front().size()) {
			buffer_.pop();
			pos = 0;
		}
		return buffer_.front()[pos];
	}

private:
	std::queue<std::vector<T>> buffer_;
	size_t pos;
};
