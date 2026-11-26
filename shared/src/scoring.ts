/**
 * Ten-pin scoring. A game is the ordered list of pins knocked down per roll; frames are derived.
 * Used by the frontend (live display, keypad limits) and the backend (validation, stored score).
 */

export type FrameMark = 'strike' | 'spare' | 'open'

export type Frame = {
  rolls: number[]
  /** null until the frame's rolls are all in. */
  mark: FrameMark | null
  /** Running total up to this frame. null while this frame or an earlier one waits for bonus rolls. */
  total: number | null
}

export type ScoredGame = {
  frames: Frame[]
  /** Running total of the last frame that can be scored. */
  total: number
  complete: boolean
}

const PINS = 10
const FRAMES = 10

/** Splits rolls into frames. Frames 1 to 9 hold one roll (strike) or two; the 10th holds the rest. */
function splitFrames(rolls: readonly number[]): number[][] {
  const frames: number[][] = []
  let i = 0
  while (i < rolls.length && frames.length < FRAMES - 1) {
    const size = rolls[i] === PINS ? 1 : 2
    frames.push(rolls.slice(i, i + size))
    i += size
  }
  if (i < rolls.length) frames.push(rolls.slice(i))
  return frames
}

/** Pins standing for the next roll of the 10th frame, or 0 when the frame is finished. */
function tenthFramePinsStanding(rolls: readonly number[]): number {
  const [first, second] = rolls
  if (first === undefined) return PINS
  if (second === undefined) return first === PINS ? PINS : PINS - first
  if (rolls.length === 3) return 0
  if (first === PINS) return second === PINS ? PINS : PINS - second
  return first + second === PINS ? PINS : 0
}

/** Returns an error message for an impossible roll sequence, or null when it's valid. Partial games are valid. */
export function validateRolls(rolls: readonly number[]): string | null {
  if (rolls.length > 21) return 'A game has at most 21 rolls'
  for (const pins of rolls) {
    if (!Number.isInteger(pins) || pins < 0 || pins > PINS)
      return 'Each roll knocks down 0 to 10 pins'
  }
  const frames = splitFrames(rolls)
  for (const [index, frame] of frames.entries()) {
    if (index < FRAMES - 1) {
      const [first = 0, second = 0] = frame
      if (first + second > PINS) return `Frame ${index + 1} knocks down more than 10 pins`
      continue
    }
    // 10th frame: check each roll against the pins left standing before it.
    for (let r = 0; r < frame.length; r++) {
      const standing = tenthFramePinsStanding(frame.slice(0, r))
      if (standing === 0) return 'The 10th frame has no roll left'
      if ((frame[r] ?? 0) > standing)
        return 'The 10th frame knocks down more pins than are standing'
    }
  }
  return null
}

/** Scores a valid roll list. Throws on an invalid one, so callers validate untrusted input first. */
export function scoreGame(rolls: readonly number[]): ScoredGame {
  const error = validateRolls(rolls)
  if (error) throw new Error(error)

  const frameRolls = splitFrames(rolls)
  const frames: Frame[] = []
  let start = 0
  let running: number | null = 0
  let lastKnownTotal = 0

  for (const [index, own] of frameRolls.entries()) {
    const isTenth = index === FRAMES - 1
    const [first = 0, second = 0] = own
    let mark: FrameMark | null = null
    let frameScore: number | null = null

    if (isTenth) {
      if (own.length >= 2)
        mark = first === PINS ? 'strike' : first + second === PINS ? 'spare' : 'open'
      if (tenthFramePinsStanding(own) === 0) frameScore = own.reduce((sum, pins) => sum + pins, 0)
    } else if (first === PINS) {
      mark = 'strike'
      const bonus = rolls.slice(start + 1, start + 3)
      if (bonus.length === 2) frameScore = PINS + (bonus[0] ?? 0) + (bonus[1] ?? 0)
    } else if (own.length === 2) {
      mark = first + second === PINS ? 'spare' : 'open'
      if (mark === 'open') frameScore = first + second
      else if (start + 2 < rolls.length) frameScore = PINS + (rolls[start + 2] ?? 0)
    }

    running = running !== null && frameScore !== null ? running + frameScore : null
    if (running !== null) lastKnownTotal = running
    frames.push({ rolls: own, mark, total: running })
    start += own.length
  }

  const tenth = frameRolls[FRAMES - 1]
  const complete = tenth !== undefined && tenthFramePinsStanding(tenth) === 0
  return { frames, total: lastKnownTotal, complete }
}

/** Pins standing for the next roll, or 0 when the game is complete. The keypad disables higher numbers. */
export function pinsStanding(rolls: readonly number[]): number {
  const frames = splitFrames(rolls)
  const last = frames.at(-1)
  if (last === undefined) return PINS
  if (frames.length === FRAMES) return tenthFramePinsStanding(last)
  const [first = 0] = last
  return last.length === 1 && first < PINS ? PINS - first : PINS
}
