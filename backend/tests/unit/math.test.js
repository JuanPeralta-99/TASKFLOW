function sum(a, b) {
    return a + b;
}

test("sum function", () => {
    expect(sum(2, 3)).toBe(5);
});
