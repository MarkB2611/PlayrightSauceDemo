// @ts-check
import {test, expect} from "@playwright/test"
import { signInAndGoToProductList } from "./ProductList.spec"


// Clicking the “back to products” button returns to the product list page
test("Clicking the “back to products” button returns to the product list page", async ({ page }) => {
    await signInAndGoToProductList(page);


    //gets the item and clicks on it
    const defaultItem = page.locator('.inventory_item_name').first();
    await defaultItem.click();
    await expect(page).toHaveURL("https://www.saucedemo.com/inventory-item.html?id=4");
    //Tests the back button
    const backButton = page.locator('.inventory_details_back_button').first();
    await backButton.click();
    await expect(page).toHaveURL("https://www.saucedemo.com/inventory.html");
    
});

// Clicking the “Add to cart” button behaves the same way as on the product list
//page
test(" Clicking the “Add to cart” button behaves the same way as on the product list page", async ({ page }) => {
    await signInAndGoToProductList(page);


    //selects image
    const defaultItem = page.locator('.inventory_item_name').first();
    await defaultItem.click();
    await expect(page).toHaveURL("https://www.saucedemo.com/inventory-item.html?id=4");

    //test the add to cart feature
    //selects image
    const btn = page.locator('.btn_inventory').first();
    const shoppingCart = page.locator(".shopping_cart_badge")
    await btn.click();

    //Button says remove from cart - note it says remove if this were a real test automation suite
    // I would clarify whether it needs to exactly say "remove from cart" instead of "Remove"
    await expect(btn).toHaveText("Remove");
    await expect(shoppingCart).toHaveText("1")
});

// If a product is already in the cart the button says “Remove from cart” when the
//page is loaded
test("If a product is already in the cart the button says “Remove from cart” when the page is loaded", async ({ page }) => {
    await signInAndGoToProductList(page);

    //select item
    const btn = page.locator('.btn_inventory').first();
    await btn.click();


    //gets the item and clicks on it
    const defaultItem = page.locator('.inventory_item_name').first();
    await defaultItem.click();
    await expect(page).toHaveURL("https://www.saucedemo.com/inventory-item.html?id=4");

    //checks the button has the correct text
    const itemBtn = page.locator('.btn_inventory').first();
    await expect(itemBtn).toHaveText("Remove");
    
});