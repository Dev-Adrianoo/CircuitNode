import { type LedData, type TemporalBehavior, type BehaviorUpdateContext } from "@/core/types";
import { produce } from "immer";


class DirectOnOffBehavior implements TemporalBehavior {
  update(nodeData: LedData, context: BehaviorUpdateContext): LedData {
    return produce(nodeData, (draft: LedData) => {
      draft.isOn = context.isPowered;
    });
  }
}


class PulseBehavior implements TemporalBehavior {
  update(nodeData: LedData, context: BehaviorUpdateContext): LedData {
    const duration = nodeData.behavior.duration ?? 1000;
    const delay = nodeData.behavior.delay ?? 0;

    return produce(nodeData, (draft: LedData) => {
      if (!draft.internalState) {
        draft.internalState = {};
      }
      const wasPowered = draft.internalState.wasPowered ?? false;

      if (context.isPowered && !wasPowered) {
        draft.internalState.lastStateChangeTime = context.currentTime; 
      }

     
      if (context.isPowered) {
        const powerOnTime = draft.internalState.lastStateChangeTime ?? context.currentTime;
        const elapsedTimeSincePowerOn = context.currentTime - powerOnTime;

        if (elapsedTimeSincePowerOn >= delay) {
          
          if (elapsedTimeSincePowerOn < delay + duration) {
            draft.isOn = true;
          } else {
            draft.isOn = false; 
          }
        } else {
          draft.isOn = false; 
        }
      }

     
      if (!context.isPowered && wasPowered) {
        draft.isOn = false;
        delete draft.internalState.lastStateChangeTime; 
      }

      
      draft.internalState.wasPowered = context.isPowered;
    });
  }
}


class BlinkBehavior implements TemporalBehavior {
  update(nodeData: LedData, context: BehaviorUpdateContext): LedData {
    const frequency = nodeData.behavior.frequency ?? 1; 

    return produce(nodeData, (draft: LedData) => {
      if (context.isPowered) {
        const cycleDuration = 1000 / frequency; 
        const halfCycle = cycleDuration / 2;
        const isEvenCycle = Math.floor(context.currentTime / halfCycle) % 2 === 0;
        draft.isOn = isEvenCycle;
      } else {
        draft.isOn = false;
      }
    });
  }
}


export const behaviorStrategies: { [key: string]: TemporalBehavior } = {
  'direct': new DirectOnOffBehavior(),
  'delay': new PulseBehavior(),
  'blink': new BlinkBehavior(),
};
