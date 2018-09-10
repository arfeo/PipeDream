/*
 *	Directions:
 *	0 -> N
 *	1 -> E
 *	2 -> S
 *	3 -> W
 */

import { IConstants } from './types/global';

export const constants: IConstants = {
  elementsSpec: [
    {
      /*
       *       ______
       *      |      |
       *      |_    _|
       *        |  |
       *        |  |
       */
      type: 0,
      outlets: [
        [0],
        [1],
        [2],
        [3],
      ],
    },
    {
      /*
       *        |  |
       *        |  |
       *        |  |
       *        |  |
       *        |  |
       */
      type: 1,
      outlets: [
        [0, 2],
        [1, 3],
        [2, 0],
        [3, 1],
      ],
    },
    {
      /*
       *        |  |
       *        |  |
       *        |__|
       *
       *
       */
      type: 2,
      outlets: [
        [0],
        [1],
        [2],
        [3],
      ],
    },
    {
      /*
       *        |  |
       *    ____|  |____
       *    ____    ____
       *        |  |
       *        |  |
       */
      type: 3,
      outlets: [
        [0, 1, 2, 3],
        [1, 2, 3, 0],
        [2, 3, 0, 1],
        [3, 0, 1, 2],
      ],
    },
    {
      /*
       *        |  |
       *    ____|  |____
       *    ____________
       *
       *
       */
      type: 4,
      outlets: [
        [0, 1, 3],
        [0, 1, 2],
        [1, 2, 3],
        [2, 3, 0],
      ],
    },
    {
      /*
       *        |  |
       *        |  |____
       *        |_______
       *
       *
       */
      type: 5,
      outlets: [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 0],
      ],
    },
  ],
  difficultyMatrix: [
    {
      name: 'Easy',
      speed: 40,
      time: 120,
      scorex: 1,
    },
    {
      name: 'Hard',
      speed: 25,
      time: 90,
      scorex: 3,
    },
    {
      name: 'Nightmare',
      speed: 10,
      time: 60,
      scorex: 5,
    },
  ],
};
