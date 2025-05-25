import { testWithSynpress } from "@synthetixio/synpress";
import { MetaMask, metaMaskFixtures } from "@synthetixio/synpress/playwright";
import basicSetup from "../wallet-setup/basic.setup";

// Create a test instance with Synpress and MetaMask fixtures
const test = testWithSynpress(metaMaskFixtures(basicSetup));

// Extract expect function from test
const { expect } = test;

test("has title", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/TSender/);
});

test("should show the AirdropForm when Metamask is connected, otherwise, not", async ({
  page,
  context,
  metamaskPage,
  extensionId,
}) => {
  await page.goto("/");
  await expect(page.getByText("Please connect a wallet...")).toBeVisible();

  // Create a new MetaMask instance
  const metamask = new MetaMask(
    context,
    metamaskPage,
    basicSetup.walletPassword,
    extensionId
  );

  // Click the connect button
  await page.getByTestId("rk-connect-button").click();

  // Wait for the wallet options to appear
  await page.getByTestId("rk-wallet-option-io.metamask").waitFor({
    state: "visible",
    timeout: 10000,
  });

  // Click connect with MetaMask option
  await page.getByTestId("rk-wallet-option-io.metamask").click();

  // Connect MetaMask to the dapp
  await metamask.connectToDapp();

  // Connect to Anvil network
  const customNetwork = {
    name: "Anvil",
    rpcUrl: "http://127.0.0.1:8545",
    chainId: 31337,
    symbol: "ETH",
  };
  await metamask.addNetwork(customNetwork);

  await expect(page.getByText("Token Address")).toBeVisible();

  // Verify the connected account address
  await page.getByTestId("rk-account-button").click();
  await expect(page.locator("#rk_profile_title").first()).toHaveText(
    "0xf3…2266"
  );
});
