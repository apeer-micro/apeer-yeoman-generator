var Generator = require('yeoman-generator');

module.exports = class extends Generator {
    constructor(args, opts) {
        super(args, opts);
    }

    initializing() { }

    async prompting() {
        this.answers = await this.prompt([{
            type: 'input',
            name: 'module_name',
            message: 'Your module name',
            default: 'my-apeer-module',
        }, {
            type: 'list',
            name: 'programming_language',
            message: 'Programming language',
            choices: ['Python', 'MATLAB', 'JAVA'],
            default: 'Python',
            store: true,
        },]);
    }

    configuring() { }

    default() { }

    writing() {
        switch (this.answers.programming_language) {
            case 'Python':
                this.sourceRoot(this.templatePath() + '/python_module')
                this.fs.copyTpl(
                    this.templatePath('apeer_main.py'),
                    this.destinationPath('apeer_main.py')
                );
                this.fs.copyTpl(
                    this.templatePath('your_code.py'),
                    this.destinationPath('your_code.py'),
                    { module_name: this.answers.module_name }
                );
                break;

            default:
                break;
        }
    }

    conflicts() { }

    install() { }

    end() { }
};