class FSM {
     constructor(config) {
        this.state = config.initial;
        this.states = [];
        this.states[0] = config.initial;
        this.undoned = [];
        this.countUndo=0;
        this.callChange = false;
        this.mapStates = new Map();
        this.mapRelations = new Map();

        for(let sta in config.states) {
          this.mapStates.set(sta, config.states[sta]);
        };

        for(let statKey of this.mapStates.keys()) { 
          let mapEvents = new Map();
          for(let eve in (this.mapStates.get(statKey)).transitions ) {
            mapEvents.set(eve, (this.mapStates.get(statKey)).transitions[eve]);
          }
          this.mapRelations.set(statKey, mapEvents);  
        };
    };

  getState() {
        return this.state;
    };


  changeState(state) {
    let except = true;
    try{
        for(let statKey of this.mapRelations.keys()) {
            if (state == statKey){
            this.state = state;
            this.states.push(state);
            this.callChange = true;
            except = false;
          }
        }
        if(except){
        throw new Error("It isn't correct state!");
        }
      } catch (e){
         alert(e.name+" "+e.message);
      }
    };

  trigger(event) {
      try{
        let except = true;
        let currentState = this.state;
        for(let statKey of this.mapRelations.keys()) { 
            if(statKey == currentState){
                 for(let eve of (this.mapRelations.get(statKey)).keys()) { 
                    if(eve == event){
                      this.changeState(this.mapRelations.get(statKey).get(eve));
                      except = false;
                    } 
                }
            }     
        }
        if (except) {
          throw new Error("It isn't correct event!");
        }    
      } catch (e){
        alert(e.name+" "+e.message);
      }      
    };

    reset() {
      let initStat = this.states[0];
      this.states.length = 0;
      this.changeState(initStat);
      this.countUndo = 0;
      this.callChange = false;
    };

    getStates(event) {
      let arrStatForEvent = [];
      if (event == undefined) {
          for(let statKey of this.mapRelations.keys()) { 
              arrStatForEvent.push(statKey);
          }
      } else {
          for(let statKey of this.mapRelations.keys()) { 
               for(let eve of (this.mapRelations.get(statKey)).keys()) { 
                  if(event == eve){
                    arrStatForEvent.push(statKey);
                  }  
              }      
          } 
      }
      return arrStatForEvent;       
    };

    undo() {
      let num = this.states.length;
      if (num > 1){
        this.undoned.push(this.states[num-1]);
        this.countUndo++;
        this.state = this.states[num-2];
        this.states.length = num-1;
        this.callChange = false;
        return true;
      } else {
        return false;
      }
    };

    redo() {
      if(this.countUndo<=0 || this.callChange == true){
        return false;
      } else {
        this.changeState(this.undoned[this.countUndo-1]);
        this.countUndo--;
        return true; 
      }
    };

    clearHistory() {
      let currentState = this.states[(this.states.length-1)];
      this.states.length = 0;
      this.changeState(currentState);
      this.countUndo = 0;
      this.callChange == true;
    };
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/
