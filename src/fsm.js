class FSM {
     constructor(config) {
        this.state = config.initial;
         this.states =new Array();
         this.states[0] = config.initial;
         this.undoned = new Array();
         this.countUndo=0;
         this.callChange = false;

            this.mapStates = new Map();
           
            this.mapRelations = new Map();

            for(var sta in config.states) {
            this.mapStates.set(sta, config.states[sta]);
            }

            for(var statKey of this.mapStates.keys()) { 
                 var mapEvents = new Map();
                for(var eve in (this.mapStates.get(statKey)).transitions ) {
                mapEvents.set(eve, (this.mapStates.get(statKey)).transitions[eve]);
                }
            this.mapRelations.set(statKey, mapEvents);  
            }
    }

    getState() {
        return this.state;
    }

    changeState(state) {
        this.state = state;
        this.states.push(state);
        this.callChange = true;
       
    }

    trigger(event) {
        var currentState = this.state;
        for(var statKey of this.mapRelations.keys()) { 
            if(statKey == currentState){
                 for(var eve of (this.mapRelations.get(statKey)).keys()) { 
                    if(eve == event){
                       this.changeState(this.mapRelations.get(statKey).get(eve));
                    }
                }
            }      
        }       
    }

     reset() {
        var initStat = this.states[0];
        this.states.length = 0;
        this.changeState(initStat);
        this.countUndo = 0;
        this.callChange = false;
    }

    getStates(event) {
        var arrStatForEvent = new Array();

        if (event == undefined) {
            for(var statKey of this.mapRelations.keys()) { 
                arrStatForEvent.push(statKey);
            }
        } else {
            for(var statKey of this.mapRelations.keys()) { 
                 for(var eve of (this.mapRelations.get(statKey)).keys()) { 
                    if(event == eve){
                        console.log(event + ' > ' + eve + ' > ' + statKey);
                        arrStatForEvent.push(statKey);
                    }  
                }      
            } 
        }
        return arrStatForEvent;       
    }

    undo() {
        var num = this.states.length;
        if (num > 1){
            this.undoned.push(this.states[num-1]);
            this.countUndo++;
            this.state = this.states[num-2];
            this.states.length = num-1;
            this.callChange = false;
            return true;
        }else {
            return false;
        }
    }

    redo() {
        if(this.countUndo<=0 || this.callChange == true){
            return false;
        }else {
         this.changeState(this.undoned[this.countUndo-1]);
         this.countUndo--;
            return true; 
        }


    }


    clearHistory() {
        var currentState = this.states[(this.states.length-1)];
        this.states.length = 0;
        this.changeState(currentState);
        this.countUndo = 0;
        this.callChange == true;

    }
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/
