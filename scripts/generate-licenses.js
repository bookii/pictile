import fs from "node:fs";
import path from "node:path";

async function readStdin() {
  const chunks = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks).toString("utf8");
}

async function generateLicenseText() {
  let licensesData;

  try {
    // 標準入力から読み込み（パイプライン用）
    const stdin = await readStdin();
    licensesData = JSON.parse(stdin);

    // ライセンス別にパッケージをグループ化
    const licenseGroups = {};
    let totalPackages = 0;

    Object.entries(licensesData).forEach(([packageName, info]) => {
      // 自分のプロジェクト（pictile）はスキップ
      if (packageName.startsWith("pictile@")) return;

      const license = info.licenses;
      if (!licenseGroups[license]) {
        licenseGroups[license] = [];
      }
      licenseGroups[license].push({ packageName, info });
      totalPackages++;
    });

    // テキスト生成
    let output = "";

    // 各ライセンスグループの詳細
    Object.entries(licenseGroups)
      .sort(([, a], [, b]) => b.length - a.length)
      .forEach(([license, packages]) => {
        output +=
          "===============================================================================\n";
        output += `${license.toUpperCase()} PACKAGES\n`;
        output +=
          "===============================================================================\n\n";
        output += `The following packages are licensed under ${license}:\n\n`;

        // パッケージリスト（名前でソート）
        packages.sort((a, b) => a.packageName.localeCompare(b.packageName));
        packages.forEach(({ packageName, info }) => {
          output += `• ${packageName}\n`;
          if (info.copyright && info.copyright.trim()) {
            output += `  ${info.copyright}\n`;
          }
          if (info.repository && info.repository.trim()) {
            output += `  Repository: ${info.repository}\n`;
          }
          output += "\n";
        });

        output += "\n";
      });

    // フッター
    output +=
      "===============================================================================\n\n";
    output += "Generated for PICTILE\n\n";
    output += "NOTICE:\n";
    output +=
      "This file lists third-party software components and their licenses.\n";
    output +=
      "Complete license texts are available at the repository URLs listed above.\n";
    output +=
      "By using this software, you agree to comply with all applicable license terms.\n\n";
    output +=
      "For complete and up-to-date license information, please refer to the original\n";
    output += "package repositories listed above.\n\n";
    output += `Last updated: ${new Date().toISOString().split("T")[0]}\n`;
    output += `Total packages: ${totalPackages}\n`;

    // 出力先を決定
    const outputPath = path.join(process.cwd(), "dist", "THIRD_PARTY_LICENSES");

    // distディレクトリが存在しない場合は作成
    const distDir = path.dirname(outputPath);
    if (!fs.existsSync(distDir)) {
      fs.mkdirSync(distDir, { recursive: true });
    }

    // ファイルに書き込み
    fs.writeFileSync(outputPath, output, "utf8");

    console.log(`✅ License file generated: ${outputPath}`);
    console.log(`📦 Total packages processed: ${totalPackages}`);
    console.log(`📋 License types: ${Object.keys(licenseGroups).length}`);
  } catch (error) {
    console.error("❌ Error generating license file:", error.message);
    process.exit(1);
  }
}

generateLicenseText();
