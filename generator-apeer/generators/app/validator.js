module.exports = {
    is_number: function(candidate) {
        return !(candidate === '') && !isNaN(candidate) && candidate !== undefined
    },

    is_integer: function(candidate) {
        return this.is_number(candidate) && (candidate % 1) === 0
    },

    is_number_tuple: function(candidate) {
        const first = candidate.split(',')[0]
        const second = candidate.split(',')[1]
        return this.is_number(first) && this.is_number(second)
    }
}