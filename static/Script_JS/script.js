{/* <script> */}
      const form = document.getElementById("upload-form");
      const fileInput = document.getElementById("file-input");
      const dropArea = document.getElementById("drop-area");
      const loader = document.getElementById("loader");
      const result = document.getElementById("result");
      const originalImg = document.getElementById("original-img");
      const upscaledImg = document.getElementById("upscaled-img");
      const downloadBtn = document.getElementById("download-btn");

      const statusMsg = document.getElementById("status-msg");

      function showStatus() {
        statusMsg.style.display = "block";
      }

      // Drag & Drop
      dropArea.addEventListener("click", () => fileInput.click());
      dropArea.addEventListener("dragover", (e) => {
        e.preventDefault();
        dropArea.classList.add("active");
      });
      dropArea.addEventListener("dragleave", () =>
        dropArea.classList.remove("active")
      );
      dropArea.addEventListener("drop", (e) => {
        e.preventDefault();
        fileInput.files = e.dataTransfer.files;
      });

      form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const scale = document.getElementById("scale").value;

        loader.style.display = "block";
        result.style.display = "none";

        const response = await fetch("/upload", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        originalImg.src = data.original_url;
        originalImg.style.width = "200px"; // Always show original in 100px

        upscaledImg.src = data.upscaled_url;
        upscaledImg.style.width = scale === "4" ? "800px" : "400px";

        downloadBtn.href = data.upscaled_url;

        document.getElementById(
          "upscaled-title"
        ).textContent = `Upscaled (${scale}x)`;

        loader.style.display = "none";
        result.style.display = "flex";
      });

      fileInput.addEventListener("change", () => {
        if (fileInput.files.length > 0) {
          statusMsg.textContent = "✅ Image Selected";
          statusMsg.style.display = "block";
        } else {
          statusMsg.textContent = "";
          statusMsg.style.display = "none";
        }
      });

      dropArea.addEventListener("drop", (e) => {
        e.preventDefault();
        fileInput.files = e.dataTransfer.files;

        if (fileInput.files.length > 0) {
          statusMsg.textContent = "✅ Image Selected";
          statusMsg.style.display = "block";
        }
      });
    {/* </script> */}