import { test, expect } from '@playwright/test';

test('TaskFlow E2E: Crear, editar, completar y eliminar una tarea', async ({ page }) => {
  await page.goto('/');

  // 1️⃣ Crear tarea
  const taskTitle = 'Mi primera tarea E2E';
  await page.getByPlaceholder('Escribe una nueva tarea...').fill(taskTitle);
  await page.getByRole('button', { name: 'Agregar' }).click();

  // Esperar a que la tarea aparezca
  const createdTask = page.locator('ul li', { hasText: taskTitle }).first();
  await expect(createdTask).toBeVisible({ timeout: 10000 });

  // 2️⃣ Editar tarea
  // Hacer click en "Editar"
  await createdTask.getByRole('button', { name: 'Editar' }).click();

  // 🔹 Buscar el input de edición visible (no dependemos del li viejo)
  const editInput = page.locator('input[data-testid="edit-input"]:visible');
  await expect(editInput).toBeVisible({ timeout: 5000 });
  await editInput.fill('Mi segunda tarea');

  // 🔹 Botón Guardar
  const saveButton = page.locator('button[data-testid="save-btn"]:visible');
  await expect(saveButton).toBeVisible({ timeout: 5000 });
  await saveButton.click();

  // Verificar que la tarea editada aparezca
  const editedTask = page.locator('ul li', { hasText: 'Mi segunda tarea' }).first();
  await expect(editedTask).toBeVisible({ timeout: 10000 });

// 3️⃣ Completar tarea
const checkbox = editedTask.locator('input[type="checkbox"]');

// Click en el checkbox
await checkbox.click();

// Esperar explícitamente a que el checkbox esté marcado
await expect(checkbox).toBeChecked({ timeout: 5000 });

  // 4️⃣ Eliminar la tarea
  const deleteButton = editedTask.getByRole('button', { name: '✖' });
  await deleteButton.click();
  await expect(page.locator('ul li', { hasText: 'Mi segunda tarea' }).first()).not.toBeVisible();

 
});
