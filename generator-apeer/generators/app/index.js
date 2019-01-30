var Generator = require('yeoman-generator')
const yosay = require('yosay')
const pygen = require('./python_generator.js')
const validator = require('./validator.js')

module.exports = class extends Generator {
    constructor(args, opts) {
        super(args, opts)
    }

    initializing() {
        // module properties
        this.general_module_info = {
            module_name: '',
            programming_language: ''
        }
        this.module_docker = {}
        this.module_spec = {
            spec: {
                inputs: {},
                outputs: {}
            },
            ui: {
                inputs: {},
                outputs: {}
            },
            requirements: {
                hardware: {},
                network: {}
            }
        }
    }

    prompting_general_info() {
        this.log(yosay('Welcome to the APEER module generator'))

        return this.prompt([{
            type: 'input',
            name: 'module_name',
            message: 'Your module\'s name',
            default: 'my-apeer-module'
        }, {
            type: 'list',
            name: 'programming_language',
            message: 'Your module\'s programming language',
            choices: [
                { name: 'Python', value: 'python' },
                { name: 'MATLAB', value: 'matlab' }
            ],
            default: 'python'
        }]).then(answers => {
            this.general_module_info.module_name = answers.module_name
            this.general_module_info.programming_language = answers.programming_language
        })
    }

    prompting_module_specification() {
        const spec_prompt = ([{
            type: 'list',
            name: 'spec_item',
            message: 'Your module\'s specification',
            choices: [
                { name: 'Add an input', value: 'inputs' },
                { name: 'Add an output', value: 'outputs' },
                { name: 'Add a requirement', value: 'requirements' },
                { name: 'Done', value: 'done' }
            ],
            default: 'input',
            store: true
        }, {
            when: answers => answers.spec_item == 'inputs',
            type: 'list',
            name: 'spec_item_type',
            message: 'What kind of input',
            choices: [
                { name: 'Single file', value: 'type:file' },
                { name: 'Multiple files', value: 'type:list[file]' },
                { name: 'Text', value: 'type:string' },
                { name: 'Integer', value: 'type:integer' },
                { name: 'Floating point number', value: 'type:number' },
                { name: 'List of floating point numbers', value: 'type:list[number]' },
                { name: 'Numerical range', value: 'type:range' },
                { name: 'Yes/no choice', value: 'type:choice_binary' },
                { name: 'Single choice', value: 'type:choice_single' },
            ],
            default: 'file',
            store: true
        }, {
            when: answers => answers.spec_item == 'outputs',
            type: 'list',
            name: 'spec_item_type',
            message: 'What kind of output',
            choices: [
                { name: 'Single file', value: 'type:file' },
                { name: 'Multiple files', value: 'type:list[file]' },
                { name: 'Text', value: 'type:string' },
                { name: 'Integer', value: 'type:integer' },
                { name: 'Floating point number', value: 'type:number' },
                { name: 'List of floating point numbers', value: 'type:list[number]' },
                { name: 'Numerical range', value: 'type:range' },
            ],
            default: 'file',
            store: true
        }, {
            when: answers => answers.spec_item == 'inputs' || answers.spec_item == 'outputs',
            type: 'input',
            name: 'spec_item_name',
            message: 'What is the name',
            // TODO: validate input name
        }, {
            when: answers => answers.spec_item == 'requirements',
            type: 'list',
            name: 'spec_item_type',
            message: 'What kind of requirement',
            choices: [
                { name: 'Graphics processor (GPU)', value: 'gpu' },
                { name: 'Internet access', value: 'internet_access' }
            ]
        }, {
            when: answers => answers.spec_item_type == 'type:file' || answers.spec_item_type == 'type:list[file]',
            type: 'checkbox',
            name: 'file_formats',
            message: 'Select the supported file types',
            // TODO add all supported file types
            choices: [
                { name: 'CZI', value: 'czi' },
                { name: 'TIFF', value: 'tiff' },
                { name: 'OME-TIFF', value: 'ome-tiff' },
                { name: 'PNG', value: 'png' },
                { name: 'JPEG', value: 'jpeg' },
                { name: 'CSV', value: 'csv' },
                { name: 'PDF', value: 'pdf' },
                { name: 'HTML', value: 'html' },
                { name: 'XML', value: 'xml' }
            ],
        }, {
            when: answers => answers.spec_item == 'inputs' && answers.spec_item_type == 'type:string',
            type: 'input',
            name: 'string_default',
            message: 'Default value'
        }, {
            when: answers => answers.spec_item == 'inputs' && answers.spec_item_type == 'type:integer',
            type: 'input',
            name: 'integer_default',
            message: 'Default value',
            filter: answer => validator.is_integer(answer) ? Number(answer) : answer,
            validate: answer => validator.is_integer(answer) ? true : 'Not an integer'
        }, {
            when: answers => answers.spec_item == 'inputs' && answers.spec_item_type == 'type:integer',
            type: 'input',
            name: 'integer_min',
            message: 'Lower bound (leave blank if unconstrained)',
            filter: answer => validator.is_integer(answer) ? Number(answer) : answer,
            validate: answer => validator.is_integer(answer) || (answer === '') ? true : 'Not an integer or blank'
        }, {
            when: answers => answers.spec_item == 'inputs' && answers.spec_item_type == 'type:integer',
            type: 'input',
            name: 'integer_max',
            message: 'Upper bound (leave blank if unconstrained)',
            filter: answer => validator.is_integer(answer) ? Number(answer) : answer,
            validate: answer => validator.is_integer(answer) || (answer === '') ? true : 'Not an integer or blank'
        }, {
            when: answers => answers.spec_item == 'inputs' && answers.spec_item_type == 'type:number',
            type: 'input',
            name: 'number_default',
            message: 'Default value',
            filter: answer => validator.is_number(answer) ? Number(answer) : answer,
            validate: answer => validator.is_number(answer) ? true : 'Not a number'
        }, {
            when: answers => answers.spec_item == 'inputs' && answers.spec_item_type == 'type:number',
            type: 'input',
            name: 'number_min',
            message: 'Lower bound (leave blank if unconstrained)',
            filter: answer => validator.is_number(answer) ? Number(answer) : answer,
            validate: answer => validator.is_number(answer) || (answer === '') ? true : 'Not an integer or blank'
        }, {
            when: answers => answers.spec_item == 'inputs' && answers.spec_item_type == 'type:number',
            type: 'input',
            name: 'number_max',
            message: 'Upper bound (leave blank if unconstrained)',
            filter: answer => validator.is_number(answer) ? Number(answer) : answer,
            validate: answer => validator.is_number(answer) || (answer === '') ? true : 'Not a number or blank'
        }, {
            when: answers => answers.spec_item == 'inputs' && answers.spec_item_type == 'type:range',
            type: 'input',
            name: 'range_default',
            message: 'Default min,max (e.g. 3.14,47.11)',
            filter: answer => validator.is_number_tuple(answer) ? {
                lower_inclusive: Number(answer.split(',')[0]),
                upper_inclusive: Number(answer.split(',')[1])
            } : answer,
            validate: answer => (typeof answer === 'object') || validator.is_number_tuple(answer) ? true : 'Invalid min,max'
        }, {
            when: answers => answers.spec_item == 'inputs' && answers.spec_item_type == 'type:choice_binary',
            type: 'list',
            name: 'choice_binary_default',
            message: 'Default value',
            choices: [
                { name: 'True', value: true },
                { name: 'False', value: false },
            ],
            default: true
        }, {
            when: answers => answers.spec_item == 'inputs' && answers.spec_item_type == 'type:choice_single',
            type: 'input',
            name: 'choice_single_default',
            message: 'Default value'
        }, {
            when: answers => answers.spec_item == 'inputs' && answers.spec_item_type == 'type:choice_single',
            type: 'input',
            name: 'choice_single_values',
            message: 'Possible values as comma-seperated list (e.g. option1, option2, ...)',
            filter: answer => answer.split(',')
            // TODO validate list format
        }])

        // Recursively ask for further properties in the specification
        const done = this.async()
        return this.prompt(spec_prompt).then(answers => {
            if (answers.spec_item == 'done') {
                done()
                return
            }
            switch (answers.spec_item) {
                case 'inputs':
                    this._add_input(answers)
                    break
                case 'outputs':
                    this._add_output(answers)
                    break
                case 'requirements':
                    this._add_requirement(answers)
                    break
            }
            this.prompting_module_specification()
        })
    }

    _add_requirement(answers) {
        if (answers.spec_item_type == 'gpu')
            this.module_spec.requirements.hardware[answers.spec_item_type] = {}
        else if (answers.spec_item_type == 'internet_access')
            this.module_spec.requirements.network[answers.spec_item_type] = {}
    }

    _add_input(answers) {
        const parameter = this._add_parameter(answers)

        if (answers.spec_item_type == 'type:string') {
            parameter['default'] = answers.string_default
        } else if (answers.spec_item_type == 'type:integer') {
            parameter['default'] = answers.integer_default
            parameter[answers.spec_item_type]['min'] = answers.integer_min !== '' ? answers.integer_min : undefined
            parameter[answers.spec_item_type]['max'] = answers.integer_max !== '' ? answers.integer_max : undefined
        } else if (answers.spec_item_type == 'type:number') {
            parameter['default'] = answers.number_default
            parameter[answers.spec_item_type]['lower_inclusive'] = answers.number_min !== '' ? answers.number_min : undefined
            parameter[answers.spec_item_type]['upper_inclusive'] = answers.number_max !== '' ? answers.number_max : undefined
        } else if (answers.spec_item_type == 'type:range') {
            parameter['default'] = answers.range_default
        } else if (answers.spec_item_type == 'type:choice_binary') {
            parameter['default'] = answers.choice_binary_default
        } else if (answers.spec_item_type == 'type:choice_single') {
            parameter['default'] = answers.choice_single_default
            answers.choice_single_values.forEach(function (element) {
                parameter[answers.spec_item_type].push(element)
            })
        }
    }

    _add_output(answers) {
        this._add_parameter(answers)
    }

    _add_parameter(answers) {
        const parameter = this.module_spec.spec[answers.spec_item][answers.spec_item_name] = {}
        parameter[answers.spec_item_type] = answers.spec_item_type == 'type:choice_binary' ? null : {}
        parameter[answers.spec_item_type] = answers.spec_item_type == 'type:choice_single' ? [] : {}

        if (answers.spec_item_type == 'type:file' || answers.spec_item_type == 'type:list[file]') {
            parameter[answers.spec_item_type] = {
                format: answers.file_formats
            }
        }

        return parameter
    }

    configuring() { }

    default() { }

    writing() {
        this.fs.copyTpl(
            this.templatePath() + '/README.md',
            this.destinationPath() + '/README.md',
            { module_name: this.general_module_info.module_name })
        this.fs.copyTpl(
            this.templatePath() + '/module_specification.json',
            this.destinationPath() + '/module_specification.json',
            { module_spec: JSON.stringify(this.module_spec, null, 2) })

        switch (this.general_module_info.programming_language) {
            case 'python':
                this.sourceRoot(this.templatePath() + '/python')
                break
            case 'matlab':
                this.sourceRoot(this.templatePath() + '/matlab')
                break
        }

        this.fs.copyTpl(
            this.templatePath(),
            this.destinationPath(),
            {
                module_name: this.general_module_info.module_name,
                module_inputs_adk: pygen.get_adk_inputs(this.module_spec.spec['inputs']),
                module_outputs_adk: pygen.get_adk_outputs(this.module_spec.spec['outputs']),
                module_inputs_yourcode: pygen.get_yourcode_input_parameters(this.module_spec.spec['inputs']),
                module_outputs_yourcode: pygen.get_yourcode_output_parameters(this.module_spec.spec['outputs'])
            })
    }

    conflicts() { }

    install() { }

    end() { }
}