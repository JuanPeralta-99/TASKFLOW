const validateTask = require("../../utils/validateTask");

describe("validateTask", () => {
  test("debe fallar si no se envía data", () => {
    const result = validateTask();
    expect(result.valid).toBe(false);
    expect(result.error).toBe("No data provided");
  });

  test("debe fallar si title está vacío", () => {
    const result = validateTask({ title: "" });
    expect(result.valid).toBe(false);
    expect(result.error).toBe("Title is required");
  });

  test("debe fallar si title es muy corto", () => {
    const result = validateTask({ title: "hi" });
    expect(result.valid).toBe(false);
    expect(result.error).toBe("Title must be at least 3 characters");
  });

  test("debe pasar si el title es válido", () => {
    const result = validateTask({ title: "Comprar pan" });
    expect(result.valid).toBe(true);
  });
});
