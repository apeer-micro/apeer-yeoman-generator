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
            default: 'my-apeer-module'
        }, {
            type: 'list',
            name: 'programming_language',
            message: 'Programming language',
            choices: ['Python', 'MATLAB'],
            default: 'Python',
            store: true
        },]);
    }

    configuring() { }

    default() { }

    writing() {
        switch (this.answers.programming_language) {
            case 'Python':
                this.sourceRoot(this.templatePath() + '/python')
                break;
            case 'MATLAB':
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