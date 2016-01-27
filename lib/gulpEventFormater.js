var formater = {
    //Gulp events formatter
    event: function (event) {
        this.trace("#green", "logger:event","parsing gulp event:","#magenta", JSON.stringify(event));
        switch (event.src) {
            case "start":
                this.info("(","#green",event.src,") Starting sequence:" , chalk.cyan(event.message));
                break;
            case "stop":
                this.info("(","#green",event.src,") Finished:" , chalk.cyan(event.message));
                break;
            case "task_start":
                this.info("(","#green",event.src,") Starting task:" , chalk.cyan(event.task) , " - " , event.message);
                break;
            case "task_stop":
                this.info("(","#green",event.src,") Finished task:" , chalk.cyan(event.task) , " - " , event.message, "after" , chalk.magenta(event.duration));
                break;
            case "task_err":
                this.error("(","#green",event.src,") Error:" , chalk.red(event.err.message) , " in task " , chalk.cyan(event.task) , " - plugin: " , chalk.green(event.err.plugin), "after" , chalk.magenta(event.duration));
                break;
            case "err":
                this.error("(","#green",event.src,") Error:" , chalk.red(event.err.message) , " - plugin: " , chalk.green(event.err.plugin));
                break;
            default:
                this.error("#red","Unknow event:", event);
        }
    }
};