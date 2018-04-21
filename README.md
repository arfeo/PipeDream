# PipeDream

An a la Pipe Dream (Pipe Mania) puzzle game written in pure JS.

![Interface](http://arfeo.net/static/pipedream/interface.png "Interface")

Live demo: http://arfeo.net/tests/pipedream/

## Rules

Using a variety of pipe pieces presented randomly in a queue, the player must construct a path from the start piece for the onrushing sewer slime, or "flooz", which begins flowing after a time delay from the start of the round. Pieces may not be rotated; they must be placed as presented in the queue. The player can replace a previously laid piece by clicking on it, as long as the flooz has not yet reached it; however, doing so causes a short time delay before the next piece can be laid. The flooz is required to pass through a given number of pipe pieces.

## Installation

Clone the project:

```
$ git clone https://github.com/arfeo/PipeDream.git && cd PipeDream
```

Run

```
$ npm install
```

Then

```
$ gulp build
```
