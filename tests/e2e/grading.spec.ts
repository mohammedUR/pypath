import { expect, test } from '@playwright/test';
import { gradePattern } from '../../src/lib/content/grading';

/**
 * GRADE-001/002 rules (pure, no browser): strict numeric tokens,
 * indentation-preserving trace_output normalization, single-line fill_blank
 * equivalence, mcq exact ids, parsons order-sensitivity. Curriculum-wide
 * parity (all 564 canonical answers) is gated by
 * scripts/check_grading_parity.mts — this spec pins the rule contract.
 */

test('trace_output: leading indentation is significant (GRADE-001a)', () => {
  expect(gradePattern('trace_output', '5\n5\n4', '5\n5\n4').passed).toBe(true);
  expect(gradePattern('trace_output', '5\n  5\n4', '5\n5\n4').passed).toBe(false);
  expect(gradePattern('trace_output', '  5\n5', '5\n5').passed).toBe(false);
  // insignificant differences still pass
  expect(gradePattern('trace_output', 'True\r\nFalse', 'True\nFalse').passed).toBe(true);
  expect(gradePattern('trace_output', 'True  \nFalse\t', 'True\nFalse').passed).toBe(true);
  expect(gradePattern('trace_output', '\nTrue\nFalse\n\n', 'True\nFalse').passed).toBe(true);
  expect(gradePattern('trace_output', 'True\n\nFalse', 'True\n\nFalse').passed).toBe(true);
  // wrong content fails
  expect(gradePattern('trace_output', '5\n6', '5\n5').passed).toBe(false);
});

test('numeric: strict numeric tokens only (GRADE-001b)', () => {
  expect(gradePattern('numeric', '12 apples', '12').passed).toBe(false);
  expect(gradePattern('numeric', 'answer is 12', '12').passed).toBe(false);
  expect(gradePattern('numeric', '12%', '12').passed).toBe(false);
  expect(gradePattern('numeric', '', '12').passed).toBe(false);
  expect(gradePattern('numeric', '1.2.3', '12').passed).toBe(false);
  // genuine numeric forms pass
  expect(gradePattern('numeric', '12', '12').passed).toBe(true);
  expect(gradePattern('numeric', '-3.5', '-3.5').passed).toBe(true);
  expect(gradePattern('numeric', '2.0', '2').passed).toBe(true);
  expect(gradePattern('numeric', '1e2', '100').passed).toBe(true);
  expect(gradePattern('numeric', '3.145', '3.14', 0.01).passed).toBe(true);
  expect(gradePattern('numeric', '5', '12', 0.1).passed).toBe(false);
});

test('fill_blank: single-line equivalence, not semantic equivalence (GRADE-001c)', () => {
  expect(gradePattern('fill_blank', 'Float', 'float').passed).toBe(true);
  expect(gradePattern('fill_blank', '  float  ', 'float').passed).toBe(true);
  expect(gradePattern('fill_blank', 'it\u2019s', "it's").passed).toBe(true);
  expect(gradePattern('fill_blank', 'float.', 'float').passed).toBe(true);
  expect(gradePattern('fill_blank', 'التسلسلية', 'المحجوزة').passed).toBe(false);
  expect(gradePattern('fill_blank', '12 apples', 'float').passed).toBe(false);
});

test('mcq: exact option ids', () => {
  expect(gradePattern('mcq', 'opt-a', 'opt-a').passed).toBe(true);
  expect(gradePattern('mcq', ' opt-a ', 'opt-a').passed).toBe(true);
  expect(gradePattern('mcq', 'opt-b', 'opt-a').passed).toBe(false);
});

test('parsons: order-sensitive join (GRADE-002 contract, 0 active instances)', () => {
  expect(gradePattern('parsons', 'a = 1\nb = 2', 'a = 1\nb = 2').passed).toBe(true);
  expect(gradePattern('parsons', 'b = 2\na = 1', 'a = 1\nb = 2').passed).toBe(false);
});
