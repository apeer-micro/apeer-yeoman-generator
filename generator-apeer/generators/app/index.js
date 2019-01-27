﻿var Generator = require('yeoman-generator');
const yosay = require('yosay');

module.exports = class extends Generator {
    constructor(args, opts) {
        super(args, opts);
    }

    initializing() {
        // module properties
        this.general_module_info = {
            module_name: '',
            programming_language: ''
        };
        this.module_docker = {};
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
        };
    }

    prompting_general_info() {
        this.log(yosay('Welcome to the APEER module generator'));

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
            this.general_module_info.module_name = answers.module_name;
            this.general_module_info.programming_language = answers.programming_language;
        });
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
            when: function (answers) {
                return answers.spec_item == 'inputs'
            },
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
            when: function (answers) {
                return answers.spec_item == 'outputs'
            },
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
            when: function (answers) {
                return answers.spec_item == 'inputs' || answers.spec_item == 'outputs';
            },
            type: 'input',
            name: 'spec_item_name',
            message: 'What is the name',
            // TODO: validate input name
        }, {
            when: function (answers) {
                return answers.spec_item == 'requirements'
            },
            type: 'list',
            name: 'spec_item_type',
            message: 'What kind of requirement',
            choices: [
                { name: 'Graphics processor (GPU)', value: 'gpu' },
                { name: 'Internet access', value: 'internet_access' }
            ]
        }, {
            when: function (answers) {
                return answers.spec_item_type == 'type:file';
            },
            type: 'checkbox',
            name: 'file_formats',
            message: 'Select the supported file types',
            choices: ['jpg', 'png', 'tif', 'czi'],
        }]);

        const done = this.async();
        return this.prompt(spec_prompt).then(answers => {
            if (answers.spec_item == 'done') {
                done();
                return;
            }
            switch (answers.spec_item) {
                case 'inputs':
                case 'outputs':
                    this._add_parameter(answers);
                    break;
                case 'requirements':
                    this._add_requirement(answers);
                    break;
            }
            this.prompting_module_specification();
        });
    }

    _add_requirement(answers) {
        if (answers.spec_item_type == 'gpu')
            this.module_spec.requirements.hardware[answers.spec_item_type] = {};
        else if (answers.spec_item_type == 'internet_access')
            this.module_spec.requirements.network[answers.spec_item_type] = {};
    }

    _add_parameter(answers) {
        this.module_spec.spec[answers.spec_item][answers.spec_item_name] = {};
        this.module_spec.spec[answers.spec_item][answers.spec_item_name][answers.spec_item_type] = {};

        if (answers.spec_item_type == 'type:file') {
            this.module_spec.spec[answers.spec_item][answers.spec_item_name][answers.spec_item_type] = {
                format: answers.file_formats
            };
        };
    }

    configuring() { }

    default() { }

    writing() {
        this.fs.copyTpl(
            this.templatePath() + '/README.md',
            this.destinationPath() + '/README.md',
            { module_name: this.general_module_info.module_name });
        this.fs.copyTpl(
            this.templatePath() + '/module_specification.json',
            this.destinationPath() + '/module_specification.json',
            { module_spec: JSON.stringify(this.module_spec, null, 2) });

        switch (this.general_module_info.programming_language) {
            case 'python':
                this.sourceRoot(this.templatePath() + '/python')
                break;
            case 'matlab':
                this.sourceRoot(this.templatePath() + '/matlab')
                break;
        }

        this.fs.copyTpl(
            this.templatePath(),
            this.destinationPath());
    }

    conflicts() { }

    install() { }

    end() { }
};