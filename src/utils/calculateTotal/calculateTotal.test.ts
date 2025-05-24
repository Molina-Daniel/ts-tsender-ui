import { describe, it, expect } from "vitest";
import { calculateTotal } from "./calculateTotal";

describe("calculateTotal", () => {
  it("should correctly sum numbers separated by newlines", () => {
    const input = "1\n2\n3\n4\n5";
    expect(calculateTotal(input)).toBe(15);
  });

  it("should correctly sum numbers separated by commas", () => {
    const input = "1,2,3,4,5";
    expect(calculateTotal(input)).toBe(15);
  });

  it("should correctly sum numbers separated by both commas and newlines", () => {
    const input = "1,2\n3,4\n5";
    expect(calculateTotal(input)).toBe(15);
  });

  it("should ignore empty strings", () => {
    const input = "1,,2,\n,3";
    expect(calculateTotal(input)).toBe(6);
  });

  it("should ignore non-numeric values", () => {
    const input = "1,abc,2,xyz,3";
    expect(calculateTotal(input)).toBe(6);
  });

  it("should handle invalid numbers", () => {
    const input = "12three\n45";
    expect(calculateTotal(input)).toBe(57);
  });

  it("should handle whitespace", () => {
    const input = " 1 , 2 \n 3 ";
    expect(calculateTotal(input)).toBe(6);
  });

  it("should return 0 for an empty input", () => {
    expect(calculateTotal("")).toBe(0);
  });

  it("should return 0 when no valid numbers are provided", () => {
    const input = "abc,xyz,";
    expect(calculateTotal(input)).toBe(0);
  });

  it("should correctly handle decimal numbers", () => {
    const input = "1.5,2.5,3.75";
    expect(calculateTotal(input)).toBe(7.75);
  });

  it("should correctly handle negative numbers", () => {
    const input = "-1,2,-3,4";
    expect(calculateTotal(input)).toBe(2);
  });
});
