# TamerCAD: Local & Remote Armored Build System

This plan establishes a robust CI/CD pipeline and local build environment to ensure consistent APK production and source code backups.

## User Review Required

> [!IMPORTANT]
> **Source Backup Strategy**: The custom backup format (`dosyaadi.uzantisi-buildno_commitno`) will be applied during the GitHub Actions run to create a specialized zip artifact.
> **JDK Alignment**: Local build requires JDK 21/22. I will attempt to configure the project to use a local JDK path if available, or rely on the GitHub Actions for the definitive "clean" build.

## Proposed Changes

### 1. GitHub Actions Workflow
- **[NEW] .github/workflows/tamer_cad_build.yml**:
    - Build APK using JDK 21.
    - Custom Shell Script to rename all source files and zip them.
    - Upload APK and Zip as artifacts.

### 2. Local Environment Fix
- **[MODIFY] root/build.gradle.kts**: Ensure project-wide Java version compatibility.
- **[RESTORE] gradle/wrapper/gradle-wrapper.jar**: Ensure the wrapper is complete for isolated execution.

### 3. Versioning System
- Ensure `incrementVersion` task runs on every successful build to keep local and remote build numbers synchronized via `version.properties`.

## Custom Backup Logic (Actions)
The workflow will:
1. Fetch `build.number` from `version.properties`.
2. Fetch current `git rev-parse --short HEAD`.
3. Iterate over `app/src/main` files.
4. Copy and rename: `MainActivity.kt` -> `MainActivity.kt-70_a1b2c3d`.
5. Zip and upload as `sourcecodes_70_a1b2c3d.zip`.

## Verification Plan
1. Trigger a local build and check if `version.properties` increments.
2. Push to GitHub and verify the "TamerCAD Build" action succeeds.
3. Download the artifacts from GitHub Actions and verify file naming.
