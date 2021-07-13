import ProgressBar from "@badrap/bar-of-progress";

export class LoadingService {
    constructor(size,color,delay) {
        this.loading=false

        this.progressBar = new ProgressBar({
            size: size,
            color: color,
            className: "bar-of-progress",
            delay: delay,
        })
    }

    isLoading(){
        return this.loading
    }

    iniciar(){
        this.loading = true
        return this.progressBar.start()
    }

    parar(){
        this.loading = false
        return this.progressBar.finish()
    }
    
 }


/*
const progressBar= new ProgressBar({
    size: 4,
    color: "#2f519b",
    className: "bar-of-progress",
    delay: 100,
}),

var isLoading = false

export const Loading = {
    isLoading: async function(){
        return isLoading
    },
    iniciar: async function(){
        progressBar.start()
    },
    parar: async function(){
        progressBar.finish()
    }
}

const progressBar = new ProgressBar({
  size: 4,
  color: "#2f519b",
  className: "bar-of-progress",
  delay: 100,
});
const Loading = async (isLoading) => {
  if(isLoading=="isLoading"){
    return progressBar.isLoading()
  }
  if(isLoading){
    progressBar.start()
  }else progressBar.finish()
}
*/