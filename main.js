(()=>{

    class OnlineService{
        constructor(){

        }
        
        init(){
            return this;
        }

        getOnlineStatus(){
            return window.navigator.onLine;
        }

        onOnline(func){
            window.addEventListener('online',func);
        }
        onOffline(func){
            window.addEventListener('offline',func);
        }
        
    }

    class SoundService{
        constructor(){
            this.onlineAudio=new Audio('assets/audio/online.ogg');
            this.offlineAudio = new Audio('assets/audio/offline.ogg');
        }

        playOnline(){
            this.stop(this.offlineAudio);
            this.onlineAudio.play();
            
        }
        playOffline(){
            this.stop(this.onlineAudio);
            this.offlineAudio.play();
        }

        stop(audio){
            audio.pause();
            audio.currentTime=0;
        }
    }
   
    class StatusComponent{
        constructor(){
            this.classes = {
                online:'green',
                offline:'red'
            };
            this.text = {
                online:'online',
                offline:'offline'
            };
            this.selector = '#status';
        }
        init(){
            this.statusEl = document.querySelector(this.selector);
            return this;
        }
        setOnline(){
            this.statusEl.textContent = this.text.online;
            this.statusEl.classList.remove(this.classes.offline);
            this.statusEl.classList.add(this.classes.online);
        }
        setOffline(){
            this.statusEl.textContent = this.text.offline;
            this.statusEl.classList.remove(this.classes.online);
            this.statusEl.classList.add(this.classes.offline);
        }
    }
    const onlineService = new OnlineService().init();
    const statusComponent = new StatusComponent().init();
    const soundService = new SoundService();


    const onlineHandler=()=>{
        statusComponent.setOnline();
        soundService.playOnline();
    }

    const offlineHandler=()=>{
        statusComponent.setOffline();
        soundService.playOffline();
    }

    onlineService.onOnline(onlineHandler);
    onlineService.onOffline(offlineHandler);

    const isOnline = onlineService.getOnlineStatus;

    if(isOnline){
        onlineHandler();
    }else{
        offlineHandler();
    }
    
})();