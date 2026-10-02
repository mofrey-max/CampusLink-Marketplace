import unittest
from pathlib import Path

from app import DIST_DIR, INDEX_FILE, get_dist_file, should_use_spa_fallback


class ReactHostTests(unittest.TestCase):
    def test_dist_folder_exists(self):
        self.assertTrue(DIST_DIR.exists())
        self.assertTrue(INDEX_FILE.exists())

    def test_get_dist_file_returns_asset(self):
        asset = get_dist_file("manifest.json")
        self.assertIsNotNone(asset)
        self.assertIsInstance(asset, Path)
        self.assertEqual(asset.name, "manifest.json")

    def test_get_dist_file_blocks_missing_or_escaped_paths(self):
        self.assertIsNone(get_dist_file(""))
        self.assertIsNone(get_dist_file("../package.json"))
        self.assertIsNone(get_dist_file("missing-file.js"))

    def test_spa_fallback_for_client_routes(self):
        self.assertTrue(should_use_spa_fallback(""))
        self.assertTrue(should_use_spa_fallback("marketplace"))
        self.assertTrue(should_use_spa_fallback("dashboard/orders"))

    def test_no_spa_fallback_for_asset_like_paths(self):
        self.assertFalse(should_use_spa_fallback("assets/index.js"))
        self.assertFalse(should_use_spa_fallback("manifest.json"))
        self.assertFalse(should_use_spa_fallback("sw.js"))


if __name__ == "__main__":
    unittest.main()
