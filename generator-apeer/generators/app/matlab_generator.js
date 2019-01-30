module.exports = {
    get_adk_inputs: function(inputs) {
        // user's code will be called like this:
        //   outputs = your_code(inputs.cell_image, inputs.table_name);

        var inputs_string = ''
        Object.keys(inputs).forEach(function (input_key) {
            inputs_string = inputs_string.concat('inputs.' + input_key + ', ');
        })

        // remove last comma and whitespace
        return inputs_string.slice(0, -2)
    },

    get_adk_outputs: function(outputs) {
        // adk writes outputs like this:
        //   adk.set_output("cell_count", outputs.cell_count);
        //   adk.set_file_output("mask_image", outputs.mask_image);

        var outputs_string = ''
        Object.keys(outputs).forEach(function (output_key) {
            var adk_method = outputs[output_key].hasOwnProperty('type:file') ? 'set_file_output' : 'set_output'
            outputs_string = outputs_string.concat('adk.' + adk_method + '(\"' + output_key + '\", outputs.' + output_key + ');')
            outputs_string = outputs_string.concat('\n    ')
        })

        // remove last newline character and whitespaces
        return outputs_string.slice(0, -5)
    },

    get_yourcode_input_parameters: function(inputs) {
        // user's code accepts a parameter list like this:
        //    def run(cell_image, table_name)

        var input_string = ''
        Object.keys(inputs).forEach(function (input_key) {
            input_string = input_string.concat(input_key + ', ');
        })

        // remove last comma and whitespace
        return input_string.slice(0, -2)
    },

    get_yourcode_output_parameters: function(outputs) {
        // user's code returns a dictionary like this:
        //   outputs.cell_count = cell_count
        //   outputs.mask_image = mask_image

        var outputs_string = ''
        Object.keys(outputs).forEach(function (output_key) {
            outputs_string = outputs_string.concat('outputs.' + output_key + ' = ' + output_key + ';')
            outputs_string = outputs_string.concat('\n    ')
        })

        // remove last newline character and whitespaces
        return outputs_string.slice(0, -5)
    }
}