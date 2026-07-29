import { expect, test } from "@playwright/test";

test("un recruteur accède aux preuves et aux contacts", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "Trouvez la panne. Rétablissez le réseau." }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "Me contacter sur LinkedIn" })).toHaveAttribute(
    "href",
    /linkedin\.com\/in\/christian-malivert/,
  );
  await expect(page.getByRole("link", { name: "Voir le code source" })).toHaveAttribute(
    "href",
    "https://github.com/malivert/novatech-networklab",
  );

  await page.goto("/recruteur");

  await expect(page.getByRole("heading", { name: "Interrogez le réseau" })).toBeVisible();
  await expect(page.getByText("DÉMONSTRATION RECRUTEUR · ÉTAPE 2/5")).toBeVisible();
  const terminal = page.getByRole("textbox", { name: "Commande PowerShell simulée" });
  await terminal.fill("ping 8.8.8.8");
  await terminal.press("Enter");
  await expect(page.getByText("Réponse de 8.8.8.8")).toBeVisible();
});

test("un cours mène du quiz au défi pratique", async ({ page }) => {
  await page.goto("/cours");

  await expect(page.getByRole("heading", { name: "Cours réseau & quiz" })).toBeVisible();
  await page.getByRole("button", { name: /Un commutateur/ }).click();
  await page.getByRole("button", { name: /Un routeur/ }).click();
  await page.getByRole("button", { name: /Les règles de communication/ }).click();
  await page.getByRole("button", { name: "Corriger mes réponses" }).click();

  await expect(page.getByText("MODULE VALIDÉ")).toBeVisible();
  await expect(page.locator(".quiz-result").getByText("100 / 100")).toBeVisible();
  await expect(page.getByRole("button", { name: /Défi : Conflit d’adresses IP/ })).toBeVisible();
});

test("la preuve technique est consultable et téléchargeable", async ({ page }) => {
  await page.goto("/preuves");

  await expect(page.getByRole("heading", { name: "Plan d’adressage NovaTech" })).toBeVisible();
  await expect(page.getByText("6 VLAN", { exact: true })).toBeVisible();
  await expect(page.getByRole("table", { name: "Plan d’adressage IPv4 des VLAN NovaTech" })).toBeVisible();
  await expect(page.getByRole("row", { name: /60 Wi-Fi invités/ })).toBeVisible();
  await expect(page.getByRole("link", { name: /Plan des VLAN/ })).toHaveAttribute(
    "href",
    "/preuves/plan-vlans-novatech.csv",
  );
  await expect(page.getByRole("link", { name: /Inventaire des adresses IP/ })).toHaveAttribute(
    "download",
    "",
  );
});

test("une route inconnue conserve une porte de sortie fonctionnelle", async ({ page }) => {
  const response = await page.goto("/rubrique-inconnue");

  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: "Cette route n’existe pas" })).toBeVisible();
  await page.getByRole("link", { name: "Retour à l’accueil" }).click();
  await expect(
    page.getByRole("heading", { name: "Trouvez la panne. Rétablissez le réseau." }),
  ).toBeVisible();
});
