import { PopComponentType, ForwardOperatorType } from '@eyepop.ai/eyepop'

export const PersonPostureAnalysis = {
  components: [{
    type: PopComponentType.INFERENCE,
    ability: 'eyepop.person:latest',
    categoryName: 'person',
    confidenceThreshold: 0.9,
    forward: {
      operator: { type: ForwardOperatorType.CROP },
      targets: [{
        type: PopComponentType.INFERENCE,
        ability: 'eyepop.image-contents:latest',
        params: {
          prompts: [{
            prompt:
              'Analyze the person\'s posture in this image and determine the categories of: ' +
              [
                'Head position (Neutral, Forward-leaning, Tilted left, Tilted right)',
                'Shoulder alignment (Level, Left higher, Right higher, Rounded/slouched)',
                'Back position (Straight, Slightly curved, Hunched, Slouched)',
                'Neck angle (Neutral, Forward, Strained)',
                'Overall posture score (Good, Fair, Poor)',
                'Describe any posture issues observed'
              ].join(', ') +
              '. Report the values of the categories as classLabels. ' +
              'If you are unable to provide a category with a value then set its classLabel to null'
          }]
        }
      }]
    }
  }]
}