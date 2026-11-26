import { describe, expect, it } from 'vitest'
import { pinsStanding, scoreGame, validateRolls } from './scoring.ts'

const repeat = (rolls: number[], times: number) => Array.from({ length: times }, () => rolls).flat()
const nineOpenFrames = repeat([0, 0], 9)

describe('scoreGame', () => {
  it('scores a perfect game as 300', () => {
    const game = scoreGame(repeat([10], 12))
    expect(game.total).toBe(300)
    expect(game.complete).toBe(true)
    expect(game.frames.map((f) => f.total)).toEqual([30, 60, 90, 120, 150, 180, 210, 240, 270, 300])
  })

  it('scores 21 fives as 150', () => {
    expect(scoreGame(repeat([5], 21))).toMatchObject({ total: 150, complete: true })
  })

  it('scores 9-0 ten times as 90', () => {
    expect(scoreGame(repeat([9, 0], 10))).toMatchObject({ total: 90, complete: true })
  })

  it('scores the 10th frame bonus balls', () => {
    expect(scoreGame([...nineOpenFrames, 10, 10, 10]).total).toBe(30)
    expect(scoreGame([...nineOpenFrames, 9, 1, 10]).total).toBe(20)
    expect(scoreGame([...nineOpenFrames, 3, 4])).toMatchObject({ total: 7, complete: true })
  })

  it('keeps running totals null while a bonus is pending', () => {
    const game = scoreGame([10, 3])
    expect(game.frames.map((f) => f.total)).toEqual([null, null])
    expect(game.total).toBe(0)
    expect(game.complete).toBe(false)

    const later = scoreGame([10, 3, 4, 6])
    expect(later.frames.map((f) => [f.mark, f.total])).toEqual([
      ['strike', 17],
      ['open', 24],
      [null, null],
    ])
    expect(later.total).toBe(24)
  })

  it('throws on invalid rolls', () => {
    expect(() => scoreGame([7, 5])).toThrow()
  })
})

describe('validateRolls', () => {
  it('accepts partial and complete games', () => {
    expect(validateRolls([])).toBeNull()
    expect(validateRolls([10, 7])).toBeNull()
    expect(validateRolls([...nineOpenFrames, 10, 3, 7])).toBeNull()
  })

  it('rejects impossible sequences', () => {
    expect(validateRolls([7, 5])).not.toBeNull()
    expect(validateRolls([11])).not.toBeNull()
    expect(validateRolls([-1])).not.toBeNull()
    expect(validateRolls([2.5])).not.toBeNull()
    expect(validateRolls([...nineOpenFrames, 3, 4, 5])).not.toBeNull()
    expect(validateRolls([...nineOpenFrames, 10, 3, 8])).not.toBeNull()
    expect(validateRolls(repeat([10], 13))).not.toBeNull()
  })
})

describe('pinsStanding', () => {
  it('limits the next roll to the pins left', () => {
    expect(pinsStanding([])).toBe(10)
    expect(pinsStanding([3])).toBe(7)
    expect(pinsStanding([3, 4])).toBe(10)
    expect(pinsStanding([10])).toBe(10)
  })

  it('follows the 10th frame rules', () => {
    expect(pinsStanding([...nineOpenFrames, 10])).toBe(10)
    expect(pinsStanding([...nineOpenFrames, 10, 4])).toBe(6)
    expect(pinsStanding([...nineOpenFrames, 6, 4])).toBe(10)
    expect(pinsStanding([...nineOpenFrames, 3, 4])).toBe(0)
    expect(pinsStanding(repeat([10], 12))).toBe(0)
  })
})
