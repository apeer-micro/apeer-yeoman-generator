var Generator = require('yeoman-generator');
const yosay = require('yosay');

module.exports = class extends Generator {
    constructor(args, opts) {
        super(args, opts);
    }

    initializing() {
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
            requirements: {}
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
            choices: [{
                name: 'Python',
                value: 'python'
            }, {
                name: 'MATLAB',
                value: 'matlab'
            }],
            default: 'python'
        }]).then(answers => {
            this.general_module_info.module_name = answers.module_name;
            this.general_module_info.programming_language = answers.programming_language;
        });
    }

    prompting_module_specification() {
        const spec_prompt = ([{
            type: 'list',
            name: 'spec_item_type',
            message: 'Your module\'s specification',
            choices: [{
                name: 'Add an input',
                value: 'input'
            }, {
                name: 'Add an output',
                value: 'output'
            }, {
                name: 'Add a requirement',
                value: 'requirement'
            }, {
                name: 'Done',
                value: 'done'
            }],
            default: 'input',
            store: true
        }]);

        const done = this.async();
        return this.prompt(spec_prompt).then(answers => {
            if (answers.spec_item_type == 'done') {
                done();
                return;
            }
            // TODO prompt for details and add input/output/req to spec
            this.prompting_module_specification();
        });
    }

    configuring() { }

    default() { }

    writing() {
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
            this.destinationPath()
        );
    }

    conflicts() { }

    install() { }

    end() { }
};