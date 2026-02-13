export const translations = {
  en: {
    common: {
      title: "Web Utils",
      subtitle: "A collection of useful tools and utilities.",
      backToCategories: "Back to Categories",
      header: {
        themeToggleAriaLabel: "Toggle theme",
        languages: {
          en: "English",
          ko: "Korean",
          ja: "Japanese",
          zh: "Chinese"
        }
      },
      categories: {
        database: {
          title: "Database",
          description: "Tools for JSON, CSV, and SQL database."
        },
        game: {
          title: "Game",
          description: "Utilities for various games."
        },
        imageVideo: {
          title: "Image & Video",
          description: "Tools for video and image manipulation."
        },
        llm: {
          title: "LLM",
          description: "Tools for Large Language Models."
        },
        geolocation: {
          title: "Geolocation",
          description: "Tools for working with geographic data."
        },
        etc: {
          title: "Etc",
          description: "Other miscellaneous utilities."
        }
      },
      tools: {
        escapedStringDecoder: {
          title: "Escaped String Decoder",
          description: "Decode escaped strings",
          page: {
            inputLabel: "Escaped String",
            inputPlaceholder: "Enter escaped text (e.g. \"\\uAD00\")",
            convert: "Convert",
            outputLabel: "Converted Text",
            errorPrefix: "Error"
          }
        },
        xlsxToSql: {
          title: "XLSX to SQL",
          description: "Convert Excel files to SQL statements",
          page: {
            converterTitle: "XLSX to SQL Converter",
            uploadXlsxFile: "Upload XLSX File",
            generatedSqlStatements: "Generated SQL Statements",
            copyToClipboard: "Copy to Clipboard"
          }
        },
        csvSorter: {
          title: "CSV Sorter",
          description: "Sort CSV data by columns",
          page: {
            title: "Advanced CSV Sorter",
            labels: {
              sortColumn: "Sort Column",
              columnPosition: "Column Position",
              secondaryColumns: "Secondary Sort Columns",
              sortOrder: "Sort Order",
              sortMethod: "Sort Method",
              caseSensitiveSort: "Case-sensitive Sort",
              handleMissing: "Handle Missing Values",
              customMissingValue: "Custom Missing Value",
              deleteComments: "Delete Comments",
              commentSymbol: "Comment Symbol",
              deleteEmptyLines: "Delete Empty Lines"
            },
            placeholders: {
              selectColumn: "Select column",
              secondaryColumns: "e.g. column1, column2",
              selectOrder: "Select order",
              selectMethod: "Select method",
              selectMethodForMissing: "Select method"
            },
            sortOrderOptions: {
              asc: "Ascending",
              desc: "Descending"
            },
            sortMethodOptions: {
              alphabetical: "Alphabetical",
              numeric: "Numeric"
            },
            missingValueOptions: {
              unchanged: "Unchanged",
              blank: "Blank",
              custom: "Custom"
            },
            downloadButton: "Download Sorted CSV",
            messages: {
              showingPrefix: "Showing first 10 rows of",
              showingSuffix: "total rows"
            }
          }
        },
        boothAlgorithmMultiplier: {
          title: "Booth Algorithm Multiplier",
          description: "Binary multiplication using Booth's algorithm",
          page: {
            title: "Booth Algorithm Multiplier",
            labels: {
              multiplicand: "Multiplicand M (-8 ~ 7):",
              multiplier: "Multiplier Q (-8 ~ 7):"
            },
            calculate: "Calculate",
            resultsTitle: "Results",
            finalTitle: "Calculation Result",
            resultTitle: "Result:",
            productLabel: "Product: ",
            headers: {
              step: "Step",
              operation: "Operation",
              q: "q0"
            },
            rangeError: "Input values must be between -8 and 7."
          }
        },
        kakaotalkChatAnalyzer: {
          title: "KakaoTalk Chat Analyzer",
          description: "Analyze chat rankings and hourly activity from KakaoTalk logs",
          page: {
            chatFileLabel: "Upload chat log file",
            pasteLabel: "Or paste chat text directly",
            rawTextPlaceholder: "[Nick] [09:12] Message",
            parsingText: "Parsing...",
            analyzeButton: "Start Analysis",
            sampleFormat: "Sample format: [Name] [10:12 AM] Message",
            parsedMessagesCount: "Parsed message count:",
            targetMessagesCount: "Current target message count:",
            preset: {
              all: "All",
              last7: "Last 7 days",
              last30: "Last 30 days",
              thisYear: "This year",
            },
            startDateLabel: "Start date",
            endDateLabel: "End date",
            openPicker: "Open",
            datePickerMin: "Min",
            datePickerMax: "Max",
            datePickerClose: "Close",
            userHourlySection: "Hourly activity by user",
            nicknameLabel: "Select user",
            nicknameSearchPlaceholder: "Search user (partial match)",
            searchingNickname: "Searching...",
            noNickname: "Not selected",
            totalUniqueUsers: "Total unique users",
            people: "people",
            noSearchResult: "No results found.",
            selectedUserHourlyTitle: "hourly activity (message count)",
            selectedUserTopMessagesTitle: "Most frequent message types",
            noMessageData: "No message data.",
            table: {
              head: {
                rank: "Rank",
                message: "Message",
                count: "Count",
                nickname: "Nickname",
                messageCount: "Message Count",
                occurrences: "Occurrences",
              },
            },
            hourlyActiveUsers: "Hourly active users (unique users)",
            hourlyMessageActivity: "Hourly messages count",
            userActivityRankingTitle: "User activity ranking (message count)",
            topMessagesTitle: "Most frequent messages ranking",
            topMessagesDescription: "Ranking table + donut chart",
            donutChartAriaLabel: "Message frequency donut chart",
          },
        
        },
        discordColorMessageGenerator: {
          title: "Discord Color Message Generator",
          description: "Generate colored messages for Discord",
          page: {
            inputPlaceholder: "Enter your message...",
            selectedRangeApply: "Apply to selected range",
            styleLabel: "Style",
            cancel: "Cancel",
            charStylePicker: "Character Style Picker",
            noTextColor: "No Text Color",
            noBgColor: "No Background Color",
            generateAndCopy: "Generate and Copy",
            preview: "Preview",
            howToTitle: "How to Use",
            step1: "Enter your message.",
            step2: "Select the text range to apply styles.",
            step3: "Choose text color, text style, and background color.",
            step4: "Apply styles to the selected range.",
            step5: "Click Generate and Copy to copy the result.",
            step6: "Paste it into a Discord code block.",
            note: "Color rendering may vary depending on the Discord client.",
            charTextColorTitle: "Character Text Color",
            charTextStyleTitle: "Character Text Style",
            charBgColorTitle: "Character Background Color"
          },
          message: "Message",
          textColor: "Text Color",
          textStyle: "Text Style",
          bgColor: "Background Color",
          default: "Default",
          black: "Black",
          red: "Red",
          green: "Green",
          yellow: "Yellow",
          blue: "Blue",
          purple: "Purple",
          cyan: "Cyan",
          white: "White",
          none: "None",
          bold: "Bold",
          underline: "Underline",
          apply: "Apply",
          generate: "Generate",
          copy: "Copy",
          copied: "Copied!",
          selectedRange: "Selected text range",
          applyTo: "apply to",
          clear: "Clear"
        },
        imageToBase64: {
          title: "Image to Base64",
          description: "Convert images to Base64 format",
          page: {
            converterTitle: "Image to Base64 Converter",
            uploadImage: "Upload Image",
            base64Output: "Base64 Output",
            copyBase64: "Copy Base64",
            copyImgSrc: "Copy <img src>",
            copyCssUrl: "Copy CSS url()"
          }
        },
        kakaomapCoordOpener: {
          title: "KakaoMap Coord Opener",
          description: "Open coordinates in KakaoMap",
          page: {
            description: "Enter latitude/longitude and open the coordinate directly in KakaoMap.",
            latitudeLabel: "Latitude",
            longitudeLabel: "Longitude",
            openButton: "Open in Map"
          }
        },
        llmVramCalculator: {
          title: "LLM VRAM Calculator",
          description: "Calculate VRAM requirements for LLMs",
          page: {
            title: "LLM VRAM Calculator (GGUF Estimate)",
            description: "Estimate VRAM usage including compute/input buffers based on Hugging Face model config and quantization.",
            labels: {
              modelId: "Hugging Face Model ID",
              hfToken: "Hugging Face Token (Optional)",
              modelSize: "Model Size (Billion Parameters)",
              batchSize: "Batch Size (Tokens)",
              contextLength: "Context Length (Tokens)",
              quantWeight: "GGUF Weight Quantization",
              quantKV: "KV Cache Quantization",
              overhead: "Additional Overhead (GB)"
            },
            placeholders: {
              modelId: "e.g., mistralai/Mistral-7B-v0.1",
              hfToken: "Enter token for private/gated models",
              modelSize: "e.g., 7",
              batchSize: "e.g., 512",
              quantWeight: "Select quantization",
              quantKV: "Select KV cache quantization",
              overhead: "e.g., 1.5"
            },
            descriptions: {
              hfTokenHelp: "Only required when loading private/gated models. Keep your token secure.",
              modelSize: "If you have clicked Load Model Info, size is filled automatically.",
              modelSizeFailed: " If manual input is required.",
              batchSize: "Input/compute buffers in tokens (llama.cpp default is usually 512).",
              contextLength: "Adjust context window size.",
              quantWeight: "Model weight quantization (bits per weight).",
              quantKV: "K/V cache quantization, default is F16.",
              overhead: "Reserve extra VRAM for CUDA driver/framework overhead, use 1.5GB by default."
            },
            status: {
              fetched: "Fetched",
              fetchFailed: "Fetch failed",
              fetching: "Fetching...",
              loadOrEnter: "Load or enter manually"
            },
            loadModelInfo: "Load Model Info",
            loading: "Loading...",
            alertTitleError: "Error",
            results: {
              title: "Estimated VRAM Breakdown",
              modelWeights: "Model Weights:",
              kvCache: "KV Cache:",
              inputBuffer: "Input Buffer:",
              computeBuffer: "Compute Buffer:",
              overhead: "Overhead:",
              total: "Total Estimated VRAM:"
            },
            messages: {
              loadingData: "Loading data...",
              calculationFailedPrefix: "Calculation failed: ",
              startPrompt: "Click \"Load Model Info\" to start.",
              validModelSizePrompt: "Enter a valid model size or load model info.",
              calculating: "Calculating..."
            },
            errors: {
              enterModelId: "Please enter a Hugging Face model ID.",
              unauthorized: "Unauthorized: Check your Hugging Face token or model permissions for config.",
              forbidden: "Forbidden: Your token may not have access to this gated/private model's config.",
              modelConfigNotFound: "Model config not found. Check the model ID.",
              fetchConfigFailed: "Failed to fetch config:",
              incompleteConfig: "Incomplete model config: Missing required fields (hidden_size, num_attention_heads, num_hidden_layers).",
              fetchModelSizeManual: "Could not fetch model size info. Please enter manually.",
              fetchModelSizeError: "Error fetching model size info. Please enter manually.",
              unknownFetchError: "An unknown error occurred while fetching model data.",
              invalidModelSize: "Invalid Model Size.",
              invalidGGUFQuant: "Invalid GGUF Quantization selected.",
              invalidContextLength: "Invalid Context Length.",
              invalidKVQuant: "Invalid KV Cache Quantization selected.",
              invalidOverhead: "Invalid Overhead value.",
              invalidHeadDimension: "Invalid model config: Cannot calculate valid head dimension (hidden_size / num_attention_heads)."
            }
          }
        },
        ntripScanner: {
          title: "NTRIP Scanner",
          description: "Scan NTRIP casters for available streams",
          page: {
            title: "NTRIP Scanner",
            casterIp: "Caster IP",
            port: "Port",
            id: "ID",
            password: "Password",
            hostPlaceholder: "e.g. 127.0.0.1",
            portPlaceholder: "e.g. 2101",
            scanStart: "Start Scan",
            scanning: "Scanning...",
            mountPointList: "Mount Point List",
            unknownError: "An unknown error occurred.",
            connectionFailed: "Connection failed."
          }
        },
        opticalPuyoReader: {
          title: "Optical Puyo Reader",
          description: "Read Puyo game board from images",
          uploadTip: "Upload a screenshot of the Puyo board. A 6x12 board will be recognized automatically.",
          uploadPngImageAriaLabel: "Upload PNG image",
          uploadedImageAlt: "Uploaded image",
          originalColors: "Original Colors",
          categorizedColors: "Categorized Colors",
          row: "Row",
          column: "Column",
          empty: "Empty",
          colorSnapSensitivity: "Color snap sensitivity",
          chainSimulatorLink: "Chain Simulator",
          openInChainSimulator: "Open in Chain Simulator"
        },
        videoCutterEncoder: {
          title: "Video Cutter Encoder",
          description: "Cut and encode video segments",
          page: {
            selectVideo: "Select a video",
            chooseVideoFile: "Choose Video File",
            selected: "Selected",
            originalVideo: "Original Video",
            trimRange: "Trim Range",
            start: "Start",
            end: "End",
            enableSizeLimit: "Enable size limit",
            selectSizeLimit: "Select size limit",
            custom: "Custom",
            processing: "Processing...",
            process: "Process",
            trimmedVideo: "Trimmed Video",
            downloadTrimmedVideo: "Download Trimmed Video",
            fixVideoReEncode: "Fix Video (Re-encode)",
            lowQualitySmallSize: "Low Quality (Small Size)",
            formatRequiresReencoding: "This format requires re-encoding",
            sizeLimitRequiresReencoding: "Size limit requires re-encoding. Disable for fast processing.",
            processFastTrim: "Process will quickly trim without re-encoding. Use fix options if video has issues.",
            formatRequiresReencodingLonger: "This format requires re-encoding. Processing may take longer.",
            loadingFFmpeg: "Loading FFmpeg core...",
            ffmpegLoaded: "FFmpeg loaded successfully!",
            ffmpegNotLoaded: "FFmpeg modules not loaded yet...",
            writingFile: "Writing file to FFmpeg...",
            fileTooBig: "File is too big to process in browser. Maximum size is 2GB.",
            trimmingFast: "Trimming video (fast mode)...",
            trimmingPrecise: "Trimming video (precise mode)...",
            trimmingLowQuality: "Trimming video (low quality mode)...",
            invalidSizeLimit: "Invalid size limit. Must be at least 1 MB.",
            targetSizeTooSmall: "Target size is too small for the selected duration. Please choose a larger size or shorter duration.",
            targetSizeSmaller: "Target size is smaller than estimated. Re-encoding...",
            targetSizeLarger: "Target size is larger than estimated. Using precise trim to preserve quality...",
            readingResult: "Reading result...",
            done: "Done!",
            memoryError: "Memory error: Try using a smaller video segment or reducing quality settings.",
            errorProcessing: "Error processing video",
            selectedFile: "Selected File",
            current: "Current",
            limitOutputFileSize: "Limit Output File Size",
            mbPlaceholder: "MB",
            fixHighQuality: "Fix Video (High Quality)",
            fixLowQuality: "Fix Video (Low Quality)",
            largeFileWarning: "Large files may take longer to process.",
            errorOccurred: "An error occurred."
          }
        },
        tetrioReplayEditor: {
          title: "Tetrio Replay Editor",
          description: "Edit Tetrio replay files",
          page: {
            invalidJson: "Invalid JSON content in the file",
            invalidFile: "Unsupported file type. Please upload a .ttrm, .ttr, or .json file.",
            edit: "Edit",
            save: "Save",
            cancel: "Cancel",
            download: "Download Replay",
            currentFile: "Current file:"
          }
        },
        qrCode: {
          title: "QR Code",
          description: "Generate and read QR codes",
          placeholder: "Enter text to generate QR code",
          tabGenerate: "Generate",
          tabRead: "Read",
          generateTitle: "Generate QR Code",
          readTitle: "Read QR Code",
          pasteFromClipboard: "Paste from clipboard (Ctrl+V)",
          orUploadFile: "Or upload a QR code image",
          uploadFile: "Upload Image",
          decodedResult: "Decoded Result",
          copyResult: "Copy",
          copied: "Copied!",
          noQrFound: "No QR code found in the image.",
          pasteHint: "Press Ctrl+V to paste a QR code image from clipboard",
          dragDropHint: "or drag & drop an image here",
          downloadQr: "Download QR Code",
          previewAlt: "Generated QR code preview"
        }
      }
    }
  },
  ko: {
    common: {
      title: "??? í‹¸ë¦¬í‹°",
      subtitle: "? ìš©???„êµ¬ ë°?? í‹¸ë¦¬í‹° ëª¨ìŒ",
      backToCategories: "ì¹´í…Œê³ ë¦¬ë¡??Œì•„ê°€ê¸?,
          header: {
            themeToggleAriaLabel: "Å×¸¶ ÀüÈ¯",
            languages: {
              en: "English",
              ko: "ÇÑ±¹¾î",
              ja: "ìíÜâåŞ",
              zh: "ñéÙş"
            }
          },
      categories: {
        database: {
          title: "?°ì´?°ë² ?´ìŠ¤",
          description: "JSON, CSV, SQL ?°ì´?°ë² ?´ìŠ¤ ?‘ì—… ?„êµ¬"
        },
        game: {
          title: "ê²Œì„",
          description: "?¤ì–‘??ê²Œì„ ? í‹¸ë¦¬í‹°"
        },
        imageVideo: {
          title: "?´ë?ì§€ ë°?ë¹„ë””??,
          description: "ë¹„ë””??ë°??´ë?ì§€ ?¸ì§‘ ?„êµ¬"
        },
        llm: {
          title: "LLM",
          description: "?€ê·œëª¨ ?¸ì–´ ëª¨ë¸ ?„êµ¬"
        },
        geolocation: {
          title: "?„ì¹˜?•ë³´",
          description: "ì§€ë¦??°ì´???‘ì—… ?„êµ¬"
        },
        etc: {
          title: "ê¸°í?",
          description: "ê¸°í? ? í‹¸ë¦¬í‹°"
        }
      },
      tools: {
        escapedStringDecoder: {
          title: "?´ìŠ¤ì¼€?´í”„ ë¬¸ì???”ì½”??,
          description: "?´ìŠ¤ì¼€?´í”„??ë¬¸ì???”ì½”??,
          page: {
            inputLabel: "?´ìŠ¤ì¼€?´í”„ ë¬¸ì??,
            inputPlaceholder: "?´ìŠ¤ì¼€?´í”„ ?ìŠ¤?¸ë? ?…ë ¥?˜ì„¸??(?? \"\\uAD00\")",
            convert: "ë³€??,
            outputLabel: "ë³€?˜ëœ ?ìŠ¤??,
            errorPrefix: "?¤ë¥˜"
          }
        },
        xlsxToSql: {
          title: "XLSX ??SQL",
          description: "?‘ì? ?Œì¼??SQL ë¬¸ìœ¼ë¡?ë³€??,
          page: {
            converterTitle: "XLSX ??SQL ë³€?˜ê¸°",
            uploadXlsxFile: "XLSX ?Œì¼ ?…ë¡œ??,
            generatedSqlStatements: "?ì„±??SQL ë¬?,
            copyToClipboard: "?´ë¦½ë³´ë“œ??ë³µì‚¬"
          }
        },
        csvSorter: {
          title: "CSV ?•ë ¬ê¸?,
          description: "CSV ?°ì´?°ë? ??ê¸°ì??¼ë¡œ ?•ë ¬"
        },
        boothAlgorithmMultiplier: {
          title: "ë¶€???Œê³ ë¦¬ì¦˜ ê³±ì…ˆê¸?,
          description: "ë¶€???Œê³ ë¦¬ì¦˜???¬ìš©???´ì§„ ê³±ì…ˆ"
        },
        kakaotalkChatAnalyzer: {
          title: "ì¹´ì¹´?¤í†¡ ì±„íŒ… ë¶„ì„ê¸?,
          description: "ì¹´ì¹´?¤í†¡ ë¡œê·¸ë¡??œìœ„?€ ?œê°„?€ë³??œë™??ë¶„ì„",
          page: {
            chatFileLabel: "Upload chat log file",
            pasteLabel: "Or paste chat text directly",
            rawTextPlaceholder: "[Nick] [09:12] Message",
            parsingText: "Parsing...",
            analyzeButton: "Start Analysis",
            sampleFormat: "Sample format: [Name] [10:12 AM] Message",
            parsedMessagesCount: "Parsed message count:",
            targetMessagesCount: "Current target message count:",
            preset: {
              all: "All",
              last7: "Last 7 days",
              last30: "Last 30 days",
              thisYear: "This year",
            },
            startDateLabel: "Start date",
            endDateLabel: "End date",
            openPicker: "Open",
            datePickerMin: "Min",
            datePickerMax: "Max",
            datePickerClose: "Close",
            userHourlySection: "Hourly activity by user",
            nicknameLabel: "Select user",
            nicknameSearchPlaceholder: "Search user (partial match)",
            searchingNickname: "Searching...",
            noNickname: "Not selected",
            totalUniqueUsers: "Total unique users",
            people: "people",
            noSearchResult: "No results found.",
            selectedUserHourlyTitle: "hourly activity (message count)",
            selectedUserTopMessagesTitle: "Most frequent message types",
            noMessageData: "No message data.",
            table: {
              head: {
                rank: "Rank",
                message: "Message",
                count: "Count",
                nickname: "Nickname",
                messageCount: "Message Count",
                occurrences: "Occurrences",
              },
            },
            hourlyActiveUsers: "Hourly active users (unique users)",
            hourlyMessageActivity: "Hourly messages count",
            userActivityRankingTitle: "User activity ranking (message count)",
            topMessagesTitle: "Most frequent messages ranking",
            topMessagesDescription: "Ranking table + donut chart",
            donutChartAriaLabel: "Message frequency donut chart",
          },
        
        },
        discordColorMessageGenerator: {
          title: "?”ìŠ¤ì½”ë“œ ì»¬ëŸ¬ ë©”ì‹œì§€ ?ì„±ê¸?,
          description: "?”ìŠ¤ì½”ë“œ??ì»¬ëŸ¬ ë©”ì‹œì§€ ?ì„±",
          page: {
            inputPlaceholder: "ë©”ì‹œì§€ë¥??…ë ¥?˜ì„¸??..",
            selectedRangeApply: "? íƒ ë²”ìœ„???ìš©",
            styleLabel: "?¤í???,
            cancel: "ì·¨ì†Œ",
            charStylePicker: "ë¬¸ì ?¤í???? íƒê¸?,
            noTextColor: "ê¸€?ìƒ‰ ?†ìŒ",
            noBgColor: "ë°°ê²½???†ìŒ",
            generateAndCopy: "?ì„± ??ë³µì‚¬",
            preview: "ë¯¸ë¦¬ë³´ê¸°",
            howToTitle: "?¬ìš© ë°©ë²•",
            step1: "ë©”ì‹œì§€ë¥??…ë ¥?©ë‹ˆ??",
            step2: "?ìš©???ìŠ¤??ë²”ìœ„ë¥?? íƒ?©ë‹ˆ??",
            step3: "ê¸€?ìƒ‰, ê¸€???¤í??? ë°°ê²½?‰ì„ ? íƒ?©ë‹ˆ??",
            step4: "? íƒ ë²”ìœ„???¤í??¼ì„ ?ìš©?©ë‹ˆ??",
            step5: "?ì„± ??ë³µì‚¬ë¥??ŒëŸ¬ ê²°ê³¼ë¥?ë³µì‚¬?©ë‹ˆ??",
            step6: "Discord ì½”ë“œ ë¸”ë¡??ë¶™ì—¬?£ì–´ ?¬ìš©?©ë‹ˆ??",
            note: "Discord ?´ë¼?´ì–¸???˜ê²½???°ë¼ ?‰ìƒ ?œì‹œê°€ ?¤ë? ???ˆìŠµ?ˆë‹¤.",
            charTextColorTitle: "ë¬¸ì ê¸€?ìƒ‰",
            charTextStyleTitle: "ë¬¸ì ê¸€???¤í???,
            charBgColorTitle: "ë¬¸ì ë°°ê²½??
          },
          message: "ë©”ì‹œì§€",
          textColor: "ê¸€???‰ìƒ",
          textStyle: "ê¸€???¤í???,
          bgColor: "ë°°ê²½ ?‰ìƒ",
          default: "ê¸°ë³¸ê°?,
          black: "ê²€??,
          red: "ë¹¨ê°•",
          green: "ì´ˆë¡",
          yellow: "?¸ë‘",
          blue: "?Œë‘",
          purple: "ë³´ë¼",
          cyan: "ì²?¡",
          white: "?°ìƒ‰",
          none: "?†ìŒ",
          bold: "êµµê²Œ",
          underline: "ë°‘ì¤„",
          apply: "?ìš©",
          generate: "?ì„±",
          copy: "ë³µì‚¬",
          copied: "ë³µì‚¬??",
          selectedRange: "? íƒ???ìŠ¤??ë²”ìœ„",
          applyTo: "?ìš© ?€??,
          clear: "ì§€?°ê¸°"
        },
        imageToBase64: {
          title: "?´ë?ì§€ ??Base64",
          description: "?´ë?ì§€ë¥?Base64 ?•ì‹?¼ë¡œ ë³€??,
          page: {
            converterTitle: "?´ë?ì§€ ??Base64 ë³€?˜ê¸°",
            uploadImage: "?´ë?ì§€ ?…ë¡œ??,
            base64Output: "Base64 ì¶œë ¥",
            copyBase64: "Base64 ë³µì‚¬",
            copyImgSrc: "<img src> ë³µì‚¬",
            copyCssUrl: "CSS url() ë³µì‚¬"
          }
        },
        kakaomapCoordOpener: {
          title: "ì¹´ì¹´?¤ë§µ ì¢Œí‘œ ?´ê¸°",
          description: "ì¹´ì¹´?¤ë§µ?ì„œ ì¢Œí‘œ ?´ê¸°"
        },
        llmVramCalculator: {
          title: "LLM VRAM ê³„ì‚°ê¸?,
          description: "LLM??VRAM ?”êµ¬?¬í•­ ê³„ì‚°"
        },
        ntripScanner: {
          title: "NTRIP ?¤ìº??,
          description: "NTRIP ìºìŠ¤?°ì—???¬ìš© ê°€?¥í•œ ?¤íŠ¸ë¦?ê²€??,
          page: {
            title: "NTRIP ?¤ìº??,
            casterIp: "ìºìŠ¤??IP",
            port: "?¬íŠ¸",
            id: "ID",
            password: "ë¹„ë?ë²ˆí˜¸",
            hostPlaceholder: "?? 127.0.0.1",
            portPlaceholder: "?? 2101",
            scanStart: "?¤ìº” ?œì‘",
            scanning: "?¤ìº” ì¤?..",
            mountPointList: "ë§ˆìš´?¸í¬?¸íŠ¸ ëª©ë¡",
            unknownError: "?????†ëŠ” ?¤ë¥˜ê°€ ë°œìƒ?ˆìŠµ?ˆë‹¤.",
            connectionFailed: "?°ê²°???¤íŒ¨?ˆìŠµ?ˆë‹¤."
          }
        },
        opticalPuyoReader: {
          title: "?´ë?ì§€ ?¸ì‹ ë¿Œìš” ë¦¬ë”",
          description: "?´ë?ì§€?ì„œ ë¿Œìš” ê²Œì„ ë³´ë“œ ?½ê¸°",
          uploadTip: "ë¿Œìš” ë³´ë“œ ?¤í¬ë¦°ìƒ·???…ë¡œ?œí•˜?¸ìš”. 6x12 ë³´ë“œë¥??ë™ ?¸ì‹?©ë‹ˆ??",
          uploadPngImageAriaLabel: "Upload PNG image",
          uploadedImageAlt: "Uploaded image",
          originalColors: "?ë³¸ ?‰ìƒ",
          categorizedColors: "ë¶„ë¥˜???‰ìƒ",
          row: "??,
          column: "??,
          empty: "ë¹ˆì¹¸",
          colorSnapSensitivity: "?‰ìƒ ?¤ëƒ… ë¯¼ê°??,
          chainSimulatorLink: "?°ì‡„ ?œë??ˆì´??,
          openInChainSimulator: "?°ì‡„ ?œë??ˆì´?°ì—???´ê¸°"
        },
        videoCutterEncoder: {
          title: "ë¹„ë””??ì»¤í„° ?¸ì½”??,
          description: "ë¹„ë””???¸ê·¸ë¨¼íŠ¸ ?ë¥´ê¸?ë°??¸ì½”??,
          page: {
            selectVideo: "ë¹„ë””??? íƒ",
            chooseVideoFile: "ë¹„ë””???Œì¼ ? íƒ",
            selected: "? íƒ??,
            originalVideo: "?ë³¸ ë¹„ë””??,
            trimRange: "?ë¥´ê¸?ë²”ìœ„",
            start: "?œì‘",
            end: "??,
            enableSizeLimit: "?¬ê¸° ?œí•œ ?¬ìš©",
            selectSizeLimit: "?¬ê¸° ?œí•œ ? íƒ",
            custom: "?¬ìš©??ì§€??,
            processing: "ì²˜ë¦¬ ì¤?..",
            process: "ì²˜ë¦¬",
            trimmedVideo: "?ë¥¸ ë¹„ë””??,
            downloadTrimmedVideo: "?ë¥¸ ë¹„ë””???¤ìš´ë¡œë“œ",
            fixVideoReEncode: "ë¹„ë””???˜ì • (?¬ì¸ì½”ë”©)",
            lowQualitySmallSize: "?€?ˆì§ˆ (?‘ì? ?¬ê¸°)",
            formatRequiresReencoding: "???•ì‹?€ ?¬ì¸ì½”ë”©???„ìš”?©ë‹ˆ??,
            sizeLimitRequiresReencoding: "?¬ê¸° ?œí•œ?€ ?¬ì¸ì½”ë”©???„ìš”?©ë‹ˆ?? ë¹ ë¥¸ ì²˜ë¦¬ë¥??„í•´ ë¹„í™œ?±í™”?˜ì„¸??",
            processFastTrim: "?¬ì¸ì½”ë”© ?†ì´ ë¹ ë¥´ê²??ë¦…?ˆë‹¤. ë¹„ë””?¤ì— ë¬¸ì œê°€ ?ˆìœ¼ë©??˜ì • ?µì…˜???¬ìš©?˜ì„¸??",
            formatRequiresReencodingLonger: "???•ì‹?€ ?¬ì¸ì½”ë”©???„ìš”?©ë‹ˆ?? ì²˜ë¦¬ ?œê°„????ê±¸ë¦´ ???ˆìŠµ?ˆë‹¤.",
            loadingFFmpeg: "FFmpeg ì½”ì–´ ë¡œë”© ì¤?..",
            ffmpegLoaded: "FFmpegê°€ ?±ê³µ?ìœ¼ë¡?ë¡œë“œ?˜ì—ˆ?µë‹ˆ??",
            ffmpegNotLoaded: "FFmpeg ëª¨ë“ˆ???„ì§ ë¡œë“œ?˜ì? ?Šì•˜?µë‹ˆ??..",
            writingFile: "FFmpeg???Œì¼ ?°ëŠ” ì¤?..",
            fileTooBig: "?Œì¼???ˆë¬´ ì»¤ì„œ ë¸Œë¼?°ì??ì„œ ì²˜ë¦¬?????†ìŠµ?ˆë‹¤. ìµœë? ?¬ê¸°??2GB?…ë‹ˆ??",
            trimmingFast: "ë¹„ë””???ë¥´??ì¤?(ë¹ ë¥¸ ëª¨ë“œ)...",
            trimmingPrecise: "ë¹„ë””???ë¥´??ì¤?(?•ë? ëª¨ë“œ)...",
            trimmingLowQuality: "ë¹„ë””???ë¥´??ì¤?(?€?ˆì§ˆ ëª¨ë“œ)...",
            invalidSizeLimit: "?˜ëª»???¬ê¸° ?œí•œ?…ë‹ˆ?? ìµœì†Œ 1MB ?´ìƒ?´ì–´???©ë‹ˆ??",
            targetSizeTooSmall: "?€???¬ê¸°ê°€ ? íƒ??ê¸¸ì´??ë¹„í•´ ?ˆë¬´ ?‘ìŠµ?ˆë‹¤. ?????¬ê¸°??ì§§ì? ê¸¸ì´ë¥?? íƒ?˜ì„¸??",
            targetSizeSmaller: "?€???¬ê¸°ê°€ ?ˆìƒë³´ë‹¤ ?‘ìŠµ?ˆë‹¤. ?¬ì¸ì½”ë”© ì¤?..",
            targetSizeLarger: "?€???¬ê¸°ê°€ ?ˆìƒë³´ë‹¤ ?½ë‹ˆ?? ?ˆì§ˆ ? ì?ë¥??„í•´ ?•ë? ?ë¥´ê¸??¬ìš© ì¤?..",
            readingResult: "ê²°ê³¼ ?½ëŠ” ì¤?..",
            done: "?„ë£Œ!",
            memoryError: "ë©”ëª¨ë¦??¤ë¥˜: ???‘ì? ë¹„ë””???¸ê·¸ë¨¼íŠ¸ë¥??¬ìš©?˜ê±°???ˆì§ˆ ?¤ì •????¶”?¸ìš”.",
            errorProcessing: "ë¹„ë””??ì²˜ë¦¬ ?¤ë¥˜",
            selectedFile: "? íƒ???Œì¼",
            current: "?„ì¬",
            limitOutputFileSize: "ì¶œë ¥ ?Œì¼ ?¬ê¸° ?œí•œ",
            mbPlaceholder: "MB",
            fixHighQuality: "ë¹„ë””???˜ì • (ê³ í’ˆì§?",
            fixLowQuality: "ë¹„ë””???˜ì • (?€?ˆì§ˆ)",
            largeFileWarning: "???Œì¼?€ ì²˜ë¦¬ ?œê°„???¤ë˜ ê±¸ë¦´ ???ˆìŠµ?ˆë‹¤.",
            errorOccurred: "?¤ë¥˜ê°€ ë°œìƒ?ˆìŠµ?ˆë‹¤."
          }
        },
        tetrioReplayEditor: {
          title: "?ŒíŠ¸ë¦¬ì˜¤ ë¦¬í”Œ?ˆì´ ?¸ì§‘ê¸?,
          description: "?ŒíŠ¸ë¦¬ì˜¤ ë¦¬í”Œ?ˆì´ ?Œì¼ ?¸ì§‘"
        },
        qrCode: {
          title: "QRì½”ë“œ",
          description: "QRì½”ë“œ ?ì„± ë°??¸ì‹",
          placeholder: "QR ì½”ë“œë¥??ì„±???ìŠ¤?¸ë? ?…ë ¥?˜ì„¸??,
          tabGenerate: "?ì„±",
          tabRead: "?¸ì‹",
          generateTitle: "QRì½”ë“œ ?ì„±",
          readTitle: "QRì½”ë“œ ?¸ì‹",
          pasteFromClipboard: "?´ë¦½ë³´ë“œ?ì„œ ë¶™ì—¬?£ê¸° (Ctrl+V)",
          orUploadFile: "?ëŠ” QRì½”ë“œ ?´ë?ì§€ ?…ë¡œ??,
          uploadFile: "?´ë?ì§€ ?…ë¡œ??,
          decodedResult: "?¸ì‹ ê²°ê³¼",
          copyResult: "ë³µì‚¬",
          copied: "ë³µì‚¬??",
          noQrFound: "?´ë?ì§€?ì„œ QRì½”ë“œë¥?ì°¾ì„ ???†ìŠµ?ˆë‹¤.",
          pasteHint: "Ctrl+Vë¡??´ë¦½ë³´ë“œ??QRì½”ë“œ ?´ë?ì§€ë¥?ë¶™ì—¬?£ìœ¼?¸ìš”",
          dragDropHint: "?ëŠ” ?´ë?ì§€ë¥??¬ê¸°???œë˜ê·?& ?œë¡­",
          downloadQr: "QRì½”ë“œ ?¤ìš´ë¡œë“œ",
          previewAlt: "?ì„±??QRì½”ë“œ ë¯¸ë¦¬ë³´ê¸°"
        }
      }
    }
  },
  ja: {
    common: {
      title: "?¦ã‚§?–ãƒ¦?¼ãƒ†?£ãƒª?†ã‚£",
      subtitle: "ä¾¿åˆ©?ªãƒ„?¼ãƒ«?¨ãƒ¦?¼ãƒ†?£ãƒª?†ã‚£??‚³?¬ã‚¯?·ãƒ§??,
      backToCategories: "?«ãƒ†?´ãƒª?¼ã«?»ã‚‹",
          header: {
            themeToggleAriaLabel: "Å×¸¶ ÀüÈ¯",
            languages: {
              en: "English",
              ko: "ÇÑ±¹¾î",
              ja: "ìíÜâåŞ",
              zh: "ñéÙş"
            }
          },
      categories: {
        database: {
          title: "?‡ãƒ¼?¿ãƒ™?¼ã‚¹",
          description: "JSON?CSV?SQL?‡ãƒ¼?¿ãƒ™?¼ã‚¹?ä½œ?„ãƒ¼??
        },
        game: {
          title: "?²ãƒ¼??,
          description: "æ§˜ã€…ãª?²ãƒ¼? ãƒ¦?¼ãƒ†?£ãƒª?†ã‚£"
        },
        imageVideo: {
          title: "?»åƒ?»å‹•??,
          description: "?•ç”»?¨ç”»?ã®ç·¨é›†?„ãƒ¼??
        },
        llm: {
          title: "LLM",
          description: "å¤§è¦æ¨¡è?èªãƒ¢?‡ãƒ«?„ãƒ¼??
        },
        geolocation: {
          title: "ä½ç½®?…å ±",
          description: "?°ç†?‡ãƒ¼?¿æ“ä½œãƒ„?¼ãƒ«"
        },
        etc: {
          title: "?ã®ä»?,
          description: "?ã®ä»–ã®?¦ãƒ¼?†ã‚£?ªãƒ†??
        }
      },
      tools: {
        escapedStringDecoder: {
          title: "?¨ã‚¹?±ãƒ¼?—æ–‡å­—åˆ—?‡ã‚³?¼ã???,
          description: "?¨ã‚¹?±ãƒ¼?—ã•?ŒãŸ?‡å­—?—ã‚’?‡ã‚³?¼ãƒ‰",
          page: {
            inputLabel: "?¨ã‚¹?±ãƒ¼?—æ–‡å­—åˆ—",
            inputPlaceholder: "?¨ã‚¹?±ãƒ¼?—ãƒ†??‚¹?ˆã‚’?¥åŠ›?—ã¦?ã ?•ã„ï¼ˆä¾‹: \"\\uAD00\"ï¼?,
            convert: "å¤‰æ›",
            outputLabel: "å¤‰æ›?•ã‚Œ?Ÿãƒ†??‚¹??,
            errorPrefix: "?¨ãƒ©??
          }
        },
        xlsxToSql: {
          title: "XLSX ??SQL",
          description: "Excel?•ã‚¡?¤ãƒ«?’SQL?‡ã«å¤‰æ›",
          page: {
            converterTitle: "XLSX ??SQL å¤‰æ›",
            uploadXlsxFile: "XLSX?•ã‚¡?¤ãƒ«?’ã‚¢?ƒãƒ—??ƒ¼??,
            generatedSqlStatements: "?Ÿæˆ?•ã‚Œ?ŸSQL??,
            copyToClipboard: "??ƒª?ƒãƒ—?œãƒ¼?‰ã«?³ãƒ”??
          }
        },
        csvSorter: {
          title: "CSV?½ãƒ¼?¿ãƒ¼",
          description: "CSV?‡ãƒ¼?¿ã‚’?—ã§?½ãƒ¼??
        },
        boothAlgorithmMultiplier: {
          title: "?–ãƒ¼?¹ã‚¢?«ã‚´?ªã‚º? ä¹—ç®—å™¨",
          description: "?–ãƒ¼?¹ã‚¢?«ã‚´?ªã‚º? ã‚’ä½¿ç”¨?—ãŸ?ã‚¤?Šãƒªä¹—ç®—"
        },
        kakaotalkChatAnalyzer: {
          title: "KakaoTalk?ãƒ£?ƒãƒˆ?†æ",
          description: "KakaoTalk??‚°?‹ã‚‰?©ãƒ³??ƒ³?°ã¨?‚é–“å¸?ˆ¥?¢ã‚¯?†ã‚£?“ãƒ†?£ã‚’?†æ",
          page: {
            chatFileLabel: "Upload chat log file",
            pasteLabel: "Or paste chat text directly",
            rawTextPlaceholder: "[Nick] [09:12] Message",
            parsingText: "Parsing...",
            analyzeButton: "Start Analysis",
            sampleFormat: "Sample format: [Name] [10:12 AM] Message",
            parsedMessagesCount: "Parsed message count:",
            targetMessagesCount: "Current target message count:",
            preset: {
              all: "All",
              last7: "Last 7 days",
              last30: "Last 30 days",
              thisYear: "This year",
            },
            startDateLabel: "Start date",
            endDateLabel: "End date",
            openPicker: "Open",
            datePickerMin: "Min",
            datePickerMax: "Max",
            datePickerClose: "Close",
            userHourlySection: "Hourly activity by user",
            nicknameLabel: "Select user",
            nicknameSearchPlaceholder: "Search user (partial match)",
            searchingNickname: "Searching...",
            noNickname: "Not selected",
            totalUniqueUsers: "Total unique users",
            people: "people",
            noSearchResult: "No results found.",
            selectedUserHourlyTitle: "hourly activity (message count)",
            selectedUserTopMessagesTitle: "Most frequent message types",
            noMessageData: "No message data.",
            table: {
              head: {
                rank: "Rank",
                message: "Message",
                count: "Count",
                nickname: "Nickname",
                messageCount: "Message Count",
                occurrences: "Occurrences",
              },
            },
            hourlyActiveUsers: "Hourly active users (unique users)",
            hourlyMessageActivity: "Hourly messages count",
            userActivityRankingTitle: "User activity ranking (message count)",
            topMessagesTitle: "Most frequent messages ranking",
            topMessagesDescription: "Ranking table + donut chart",
            donutChartAriaLabel: "Message frequency donut chart",
          },
        
        },
        discordColorMessageGenerator: {
          title: "Discord ?«ãƒ©?¼ãƒ¡?ƒã‚»?¼ã‚¸?¸ã‚§?ãƒ¬?¼ã‚¿??,
          description: "Discord?¨ã®?«ãƒ©?¼ãƒ¡?ƒã‚»?¼ã‚¸?’ç”Ÿ??,
          page: {
            inputPlaceholder: "?¡ãƒƒ?»ãƒ¼?¸ã‚’?¥åŠ›?—ã¦?ã ?•ã„...",
            selectedRangeApply: "?¸æŠç¯„å›²?«é©??,
            styleLabel: "?¹ã‚¿?¤ãƒ«",
            cancel: "??ƒ£?³ã‚»??,
            charStylePicker: "?‡å­—?¹ã‚¿?¤ãƒ«?”ãƒƒ?«ãƒ¼",
            noTextColor: "?‡å­—?²ãª??,
            noBgColor: "?Œæ™¯?²ãª??,
            generateAndCopy: "?Ÿæˆ?—ã¦?³ãƒ”??,
            preview: "?—ãƒ¬?“ãƒ¥??,
            howToTitle: "ä½¿ã„??,
            step1: "?¡ãƒƒ?»ãƒ¼?¸ã‚’?¥åŠ›?—ã¾?™ã€?,
            step2: "?©ç”¨?™ã‚‹?†ã‚­?¹ãƒˆç¯„å›²?’é¸?ã—?¾ã™??,
            step3: "?‡å­—?²ã€æ–‡å­—ã‚¹?¿ã‚¤?«ã€èƒŒ??‰²?’é¸?ã—?¾ã™??,
            step4: "?¸æŠç¯„å›²?«ã‚¹?¿ã‚¤?«ã‚’?©ç”¨?—ã¾?™ã€?,
            step5: "?Œç”Ÿ?ã—?¦ã‚³?”ãƒ¼?ã‚’?¼ã—??µ?œã‚’?³ãƒ”?¼ã—?¾ã™??,
            step6: "Discord??‚³?¼ãƒ‰?–ãƒ­?ƒã‚¯?«è²¼?Šä»˜?‘ã¦ä½¿ç”¨?—ã¾?™ã€?,
            note: "?²ã®è¡¨ç¤º?¯Discord??‚¯?©ã‚¤?¢ãƒ³?ˆç’°å¢ƒã«?ˆã£??•°?ªã‚‹?´åˆ?Œã‚?Šã¾?™ã€?,
            charTextColorTitle: "?‡å­—??‰²",
            charTextStyleTitle: "?‡å­—?¹ã‚¿?¤ãƒ«",
            charBgColorTitle: "?‡å­—??ƒŒ??‰²"
          },
          message: "?¡ãƒƒ?»ãƒ¼??,
          textColor: "?‡å­—??,
          textStyle: "?‡å­—?¹ã‚¿?¤ãƒ«",
          bgColor: "?Œæ™¯??,
          default: "?‡ãƒ•?©ãƒ«??,
          black: "é»?,
          red: "èµ?,
          green: "ç·?,
          yellow: "é»?,
          blue: "??,
          purple: "ç´?,
          cyan: "æ°´è‰²",
          white: "??,
          none: "?ªã—",
          bold: "å¤ªå­—",
          underline: "ä¸‹ç·š",
          apply: "?©ç”¨",
          generate: "?Ÿæˆ",
          copy: "?³ãƒ”??,
          copied: "?³ãƒ”?¼ã—?¾ã—?Ÿï¼",
          selectedRange: "?¸æŠ?•ã‚Œ?Ÿãƒ†??‚¹?ˆç¯„??,
          applyTo: "?©ç”¨å¯¾è±¡",
          clear: "??ƒª??
        },
        imageToBase64: {
          title: "?»åƒ ??Base64",
          description: "?»åƒ?’Base64å½¢å¼?«å¤‰??,
          page: {
            converterTitle: "?»åƒ ??Base64 å¤‰æ›",
            uploadImage: "?»åƒ?’ã‚¢?ƒãƒ—??ƒ¼??,
            base64Output: "Base64?ºåŠ›",
            copyBase64: "Base64?’ã‚³?”ãƒ¼",
            copyImgSrc: "<img src> ?’ã‚³?”ãƒ¼",
            copyCssUrl: "CSS url() ?’ã‚³?”ãƒ¼"
          }
        },
        kakaomapCoordOpener: {
          title: "?«ã‚«?ªãƒ?ƒãƒ—åº§æ¨™?ªãƒ¼?—ãƒŠ??,
          description: "?«ã‚«?ªãƒ?ƒãƒ—?§åº§æ¨™ã‚’?‹ã"
        },
        llmVramCalculator: {
          title: "LLM VRAMè¨ˆç®—æ©?,
          description: "LLM?®VRAMè¦ä»¶?’è¨ˆç®?
        },
        ntripScanner: {
          title: "NTRIP?¹ã‚­?£ãƒŠ??,
          description: "NTRIP??ƒ£?¹ã‚¿?¼ã§?©ç”¨??ƒ½?ªã‚¹?ˆãƒª?¼ãƒ ?’æ¤œç´?,
          page: {
            title: "NTRIP?¹ã‚­?£ãƒŠ??,
            casterIp: "??ƒ£?¹ã‚¿?¼IP",
            port: "?ãƒ¼??,
            id: "ID",
            password: "?‘ã‚¹??ƒ¼??,
            hostPlaceholder: "ä¾? 127.0.0.1",
            portPlaceholder: "ä¾? 2101",
            scanStart: "?¹ã‚­?£ãƒ³?‹å§‹",
            scanning: "?¹ã‚­?£ãƒ³ä¸?..",
            mountPointList: "?ã‚¦?³ãƒˆ?ã‚¤?³ãƒˆä¸€è¦?,
            unknownError: "ä¸æ˜?ªã‚¨?©ãƒ¼?Œç™º?Ÿã—?¾ã—?Ÿã€?,
            connectionFailed: "?¥ç¶š?«å¤±?—ã—?¾ã—?Ÿã€?
          }
        },
        opticalPuyoReader: {
          title: "?‰å??·ã‚ˆ?·ã‚ˆ?ªãƒ¼?€??,
          description: "?»åƒ?‹ã‚‰?·ã‚ˆ?·ã‚ˆ?²ãƒ¼? ãƒœ?¼ãƒ‰?’èª­?¿å–??,
          uploadTip: "?·ã‚ˆ?œãƒ¼?‰ã®?¹ã‚¯?ªãƒ¼?³ã‚·?§ãƒƒ?ˆã‚’?¢ãƒƒ?—ãƒ­?¼ãƒ‰?—ã¦?ã ?•ã„??x12?¤é¢?’è‡ª?•èªè­˜ã—?¾ã™??,
          uploadPngImageAriaLabel: "Upload PNG image",
          uploadedImageAlt: "Uploaded image",
          originalColors: "?ƒã®??,
          categorizedColors: "?†é¡å¾Œã®??,
          row: "è¡?,
          column: "??,
          empty: "ç©?,
          colorSnapSensitivity: "?²ã‚¹?Šãƒƒ?—æ„Ÿåº?,
          chainSimulatorLink: "?£é–?·ãƒŸ?¥ãƒ¬?¼ã‚¿??,
          openInChainSimulator: "?£é–?·ãƒŸ?¥ãƒ¬?¼ã‚¿?¼ã§?‹ã"
        },
        videoCutterEncoder: {
          title: "?“ãƒ‡?ªã‚«?ƒã‚¿?¼ã‚¨?³ã‚³?¼ã???,
          description: "?“ãƒ‡?ªã‚»?°ãƒ¡?³ãƒˆ??‚«?ƒãƒˆ?¨ã‚¨?³ã‚³?¼ãƒ‰",
          page: {
            selectVideo: "?“ãƒ‡?ªã‚’?¸æŠ",
            chooseVideoFile: "?“ãƒ‡?ªãƒ•?¡ã‚¤?«ã‚’?¸æŠ",
            selected: "?¸æŠæ¸ˆã¿",
            originalVideo: "?ªãƒª?¸ãƒŠ?«ãƒ“?‡ã‚ª",
            trimRange: "?ˆãƒª? ç¯„??,
            start: "?‹å§‹",
            end: "çµ‚äº†",
            enableSizeLimit: "?µã‚¤?ºåˆ¶?ã‚’?‰åŠ¹?«ã™??,
            selectSizeLimit: "?µã‚¤?ºåˆ¶?ã‚’?¸æŠ",
            custom: "?«ã‚¹?¿ãƒ ",
            processing: "??†ä¸?..",
            process: "??†",
            trimmedVideo: "?ˆãƒª? ã•?ŒãŸ?“ãƒ‡??,
            downloadTrimmedVideo: "?ˆãƒª? ã•?ŒãŸ?“ãƒ‡?ªã‚’?€?¦ãƒ³??ƒ¼??,
            fixVideoReEncode: "?“ãƒ‡?ªä¿®æ­£ï¼ˆ?ã‚¨?³ã‚³?¼ãƒ‰ï¼?,
            lowQualitySmallSize: "ä½å“è³ªï¼ˆå°ã•?„ã‚µ?¤ã‚ºï¼?,
            formatRequiresReencoding: "?“ã®å½¢å¼??†?¨ãƒ³?³ãƒ¼?‰ãŒå¿…è¦?§ã™",
            sizeLimitRequiresReencoding: "?µã‚¤?ºåˆ¶?ã«??†?¨ãƒ³?³ãƒ¼?‰ãŒå¿…è¦?§ã™?‚é«˜?Ÿå‡¦?†ã®?Ÿã‚?«ç„¡?¹ã«?—ã¦?ã ?•ã„??,
            processFastTrim: "?ã‚¨?³ã‚³?¼ãƒ‰?ªã—?§é«˜?Ÿã«?ˆãƒª? ã—?¾ã™?‚ãƒ“?‡ã‚ª?«å•é¡ŒãŒ?‚ã‚‹?´åˆ??¿®æ­£ã‚ª?—ã‚·?§ãƒ³?’ä½¿?¨ã—?¦ã? ã•?„ã€?,
            formatRequiresReencodingLonger: "?“ã®å½¢å¼??†?¨ãƒ³?³ãƒ¼?‰ãŒå¿…è¦?§ã™?‚å‡¦?†ã«?‚é–“?Œã‹?‹ã‚‹?´åˆ?Œã‚?Šã¾?™ã€?,
            loadingFFmpeg: "FFmpeg?³ã‚¢?’ãƒ­?¼ãƒ‰ä¸?..",
            ffmpegLoaded: "FFmpeg?Œæ?å¸¸ã«??ƒ¼?‰ã•?Œã¾?—ãŸï¼?,
            ffmpegNotLoaded: "FFmpeg?¢ã‚¸?¥ãƒ¼?«ãŒ?¾ã ??ƒ¼?‰ã•?Œã¦?„ã¾?›ã‚“...",
            writingFile: "FFmpeg?«ãƒ•?¡ã‚¤?«ã‚’?¸ãè¾¼ã¿ä¸?..",
            fileTooBig: "?•ã‚¡?¤ãƒ«?Œå¤§?ã™?ã¦?–ãƒ©?¦ã‚¶?§å‡¦?†ã§?ã¾?›ã‚“?‚æ?å¤§ã‚µ?¤ã‚º??GB?§ã™??,
            trimmingFast: "?“ãƒ‡?ªã‚’?ˆãƒª? ä¸­ï¼ˆé«˜?Ÿãƒ¢?¼ãƒ‰ï¼?..",
            trimmingPrecise: "?“ãƒ‡?ªã‚’?ˆãƒª? ä¸­ï¼ˆç²¾å¯†ãƒ¢?¼ãƒ‰ï¼?..",
            trimmingLowQuality: "?“ãƒ‡?ªã‚’?ˆãƒª? ä¸­ï¼ˆä½?è³ª?¢ãƒ¼?‰ï¼‰...",
            invalidSizeLimit: "?¡åŠ¹?ªã‚µ?¤ã‚º?¶é™?§ã™?‚æ?å°?MBä»¥ä¸Š?§ã‚?‹å¿…è¦ãŒ?‚ã‚Š?¾ã™??,
            targetSizeTooSmall: "?¿ãƒ¼?²ãƒƒ?ˆã‚µ?¤ã‚º?Œé¸?ã—?Ÿé•·?•ã«å¯¾ã—??°?•ã™?ã¾?™ã€‚ã‚ˆ?Šå¤§?ã„?µã‚¤?ºã¾?Ÿã¯??„?·ã•?’é¸?ã—?¦ã? ã•?„ã€?,
            targetSizeSmaller: "?¿ãƒ¼?²ãƒƒ?ˆã‚µ?¤ã‚º?Œæ¨å®šã‚ˆ?Šå°?•ã„?§ã™?‚å†?¨ãƒ³?³ãƒ¼?‰ä¸­...",
            targetSizeLarger: "?¿ãƒ¼?²ãƒƒ?ˆã‚µ?¤ã‚º?Œæ¨å®šã‚ˆ?Šå¤§?ã„?§ã™?‚å“è³ªã‚’ä¿ã¤?Ÿã‚?«ç²¾å¯†ãƒˆ?ªãƒ ?’ä½¿?¨ä¸­...",
            readingResult: "çµæœ?’èª­?¿å–?Šä¸­...",
            done: "å®Œäº†ï¼?,
            memoryError: "?¡ãƒ¢?ªã‚¨?©ãƒ¼ï¼šã‚ˆ?Šå°?•ã„?“ãƒ‡?ªã‚»?°ãƒ¡?³ãƒˆ?’ä½¿?¨ã™?‹ã‹?å“è³ªè¨­å®šã‚’ä¸‹ã’?¦ã? ã•?„ã€?,
            errorProcessing: "?“ãƒ‡?ªå‡¦?†ã‚¨?©ãƒ¼",
            selectedFile: "?¸æŠ?—ãŸ?•ã‚¡?¤ãƒ«",
            current: "?¾åœ¨",
            limitOutputFileSize: "?ºåŠ›?•ã‚¡?¤ãƒ«?µã‚¤?ºã‚’?¶é™",
            mbPlaceholder: "MB",
            fixHighQuality: "?“ãƒ‡?ªä¿®æ­£ï¼ˆé«˜å“è³ªï¼‰",
            fixLowQuality: "?“ãƒ‡?ªä¿®æ­£ï¼ˆä½å“è³ªï¼‰",
            largeFileWarning: "?•ã‚¡?¤ãƒ«?Œå¤§?ã„?´åˆ?å‡¦?†ã«?‚é–“?Œã‹?‹ã‚‹?“ã¨?Œã‚?Šã¾?™ã€?,
            errorOccurred: "?¨ãƒ©?¼ãŒ?ºç”Ÿ?—ã¾?—ãŸ??
          }
        },
        tetrioReplayEditor: {
          title: "?†ãƒˆ?ªã‚ª?ªãƒ—?¬ã‚¤?¨ãƒ‡?£ã‚¿??,
          description: "?†ãƒˆ?ªã‚ª?ªãƒ—?¬ã‚¤?•ã‚¡?¤ãƒ«?’ç·¨??
        },
        qrCode: {
          title: "QR?³ãƒ¼??,
          description: "QR?³ãƒ¼?‰ã®?Ÿæˆ?¨èª­?¿å–??,
          placeholder: "QR?³ãƒ¼?‰ã‚’?Ÿæˆ?™ã‚‹?†ã‚­?¹ãƒˆ?’å…¥?›ã—?¦ã? ã•??,
          tabGenerate: "?Ÿæˆ",
          tabRead: "èª?¿?–ã‚Š",
          generateTitle: "QR?³ãƒ¼?‰ç”Ÿ??,
          readTitle: "QR?³ãƒ¼?‰èª­?¿å–??,
          pasteFromClipboard: "??ƒª?ƒãƒ—?œãƒ¼?‰ã‹?‰è²¼?Šä»˜??(Ctrl+V)",
          orUploadFile: "?¾ãŸ?¯QR?³ãƒ¼?‰ç”»?ã‚’?¢ãƒƒ?—ãƒ­?¼ãƒ‰",
          uploadFile: "?»åƒ?’ã‚¢?ƒãƒ—??ƒ¼??,
          decodedResult: "èª?¿?–ã‚Šçµæœ",
          copyResult: "?³ãƒ”??,
          copied: "?³ãƒ”?¼ã—?¾ã—?Ÿï¼",
          noQrFound: "?»åƒ?‹ã‚‰QR?³ãƒ¼?‰ãŒè¦‹ã¤?‹ã‚Š?¾ã›?“ã§?—ãŸ??,
          pasteHint: "Ctrl+V?§ã‚¯?ªãƒƒ?—ãƒœ?¼ãƒ‰?®QR?³ãƒ¼?‰ç”»?ã‚’è²¼ã‚Šä»˜ã‘?¦ã? ã•??,
          dragDropHint: "?¾ãŸ??”»?ã‚’?“ã“?«ãƒ‰?©ãƒƒ?°ï¼†?‰ãƒ­?ƒãƒ—",
          downloadQr: "QR?³ãƒ¼?‰ã‚’?€?¦ãƒ³??ƒ¼??,
          previewAlt: "?Ÿæˆ?•ã‚Œ?ŸQR?³ãƒ¼?‰ã®?—ãƒ¬?“ãƒ¥??
        }
      }
    }
  },
  zh: {
    common: {
      title: "ç½‘é¡µå·¥å…·",
      subtitle: "å®ç”¨å·¥å…·?Œå®?¨ç¨‹åºé›†??,
      backToCategories: "è¿”å›?†ç±»",
          header: {
            themeToggleAriaLabel: "Å×¸¶ ÀüÈ¯",
            languages: {
              en: "English",
              ko: "ÇÑ±¹¾î",
              ja: "ìíÜâåŞ",
              zh: "ñéÙş"
            }
          },
      categories: {
        database: {
          title: "?°æ®åº?,
          description: "JSON?CSV?SQL?°æ®åº“å·¥??
        },
        game: {
          title: "æ¸¸æˆ",
          description: "?„ç§æ¸¸æˆå®ç”¨å·¥å…·"
        },
        imageVideo: {
          title: "?¾ç‰‡?Œè§†é¢?,
          description: "è§†é¢‘?Œå›¾?ç¼–è¾‘å·¥??
        },
        llm: {
          title: "LLM",
          description: "å¤§å‹è¯??æ¨¡å‹å·¥å…·"
        },
        geolocation: {
          title: "?°ç†ä½ç½®",
          description: "?°ç†?°æ®å¤„ç†å·¥å…·"
        },
        etc: {
          title: "?¶ä»–",
          description: "?¶ä»–å®ç”¨å·¥å…·"
        }
      },
      tools: {
        escapedStringDecoder: {
          title: "è½¬ä¹‰å­—ç¬¦ä¸²è§£?å™¨",
          description: "è§£ç è½¬ä¹‰å­—ç¬¦ä¸?,
          page: {
            inputLabel: "è½¬ä¹‰å­—ç¬¦ä¸?,
            inputPlaceholder: "è¾“å…¥è½¬ä¹‰?‡æœ¬ï¼ˆä¾‹å¦‚ï¼š\"\\uAD00\"ï¼?,
            convert: "è½¬æ¢",
            outputLabel: "è½¬æ¢?çš„?‡æœ¬",
            errorPrefix: "?™è?"
          }
        },
        xlsxToSql: {
          title: "XLSX è½?SQL",
          description: "å°†Excel?‡ä»¶è½¬æ¢ä¸ºSQLè¯?¥",
          page: {
            converterTitle: "XLSX è½?SQL è½¬æ¢??,
            uploadXlsxFile: "ä¸Šä¼  XLSX ?‡ä»¶",
            generatedSqlStatements: "?Ÿæˆ??SQL è¯?¥",
            copyToClipboard: "å¤åˆ¶?°å‰ªè´´æ¿"
          }
        },
        csvSorter: {
          title: "CSV?’åº??,
          description: "?‰åˆ—?’åºCSV?°æ®"
        },
        boothAlgorithmMultiplier: {
          title: "Boothç®—æ³•ä¹˜æ³•??,
          description: "ä½¿ç”¨Boothç®—æ³•è¿›è¡ŒäºŒè¿›?¶ä¹˜æ³?
        },
        kakaotalkChatAnalyzer: {
          title: "KakaoTalk?Šå¤©?†æ??,
          description: "ä»KakaoTalk?¥å¿—?†æ?’åä¸åˆ†?¶æ´»è·ƒåº¦",
          page: {
            chatFileLabel: "Upload chat log file",
            pasteLabel: "Or paste chat text directly",
            rawTextPlaceholder: "[Nick] [09:12] Message",
            parsingText: "Parsing...",
            analyzeButton: "Start Analysis",
            sampleFormat: "Sample format: [Name] [10:12 AM] Message",
            parsedMessagesCount: "Parsed message count:",
            targetMessagesCount: "Current target message count:",
            preset: {
              all: "All",
              last7: "Last 7 days",
              last30: "Last 30 days",
              thisYear: "This year",
            },
            startDateLabel: "Start date",
            endDateLabel: "End date",
            openPicker: "Open",
            datePickerMin: "Min",
            datePickerMax: "Max",
            datePickerClose: "Close",
            userHourlySection: "Hourly activity by user",
            nicknameLabel: "Select user",
            nicknameSearchPlaceholder: "Search user (partial match)",
            searchingNickname: "Searching...",
            noNickname: "Not selected",
            totalUniqueUsers: "Total unique users",
            people: "people",
            noSearchResult: "No results found.",
            selectedUserHourlyTitle: "hourly activity (message count)",
            selectedUserTopMessagesTitle: "Most frequent message types",
            noMessageData: "No message data.",
            table: {
              head: {
                rank: "Rank",
                message: "Message",
                count: "Count",
                nickname: "Nickname",
                messageCount: "Message Count",
                occurrences: "Occurrences",
              },
            },
            hourlyActiveUsers: "Hourly active users (unique users)",
            hourlyMessageActivity: "Hourly messages count",
            userActivityRankingTitle: "User activity ranking (message count)",
            topMessagesTitle: "Most frequent messages ranking",
            topMessagesDescription: "Ranking table + donut chart",
            donutChartAriaLabel: "Message frequency donut chart",
          },
        
        },
        discordColorMessageGenerator: {
          title: "Discordå½©è‰²æ¶ˆæ¯?Ÿæˆ??,
          description: "ä¸ºDiscord?Ÿæˆå½©è‰²æ¶ˆæ¯",
          page: {
            inputPlaceholder: "è¯·è¾“?¥æ¶ˆ??..",
            selectedRangeApply: "åº”ç”¨?°é€‰ä¸­?ƒå›´",
            styleLabel: "?·å¼",
            cancel: "?–æ¶ˆ",
            charStylePicker: "å­—ç¬¦?·å¼?‰æ‹©??,
            noTextColor: "? æ–‡?¬é¢œ??,
            noBgColor: "? èƒŒ??¢œ??,
            generateAndCopy: "?Ÿæˆå¹¶å¤??,
            preview: "é¢„è§ˆ",
            howToTitle: "ä½¿ç”¨?¹æ³•",
            step1: "è¾“å…¥æ¶ˆæ¯?…å???,
            step2: "?‰æ‹©è¦åº”?¨çš„?‡æœ¬?ƒå›´??,
            step3: "?‰æ‹©?‡æœ¬é¢œè‰²?æ–‡?¬æ ·å¼å’Œ?Œæ™¯é¢œè‰²??,
            step4: "å°†æ ·å¼åº”?¨åˆ°?‰ä¸­?ƒå›´??,
            step5: "?¹å‡»?œç”Ÿ?å¹¶å¤åˆ¶?å¤?¶ç»“?œã€?,
            step6: "ç²˜è´´??Discord ä»£ç ?—ä¸­ä½¿ç”¨??,
            note: "é¢œè‰²?¾ç¤º?ˆæœ??ƒ½??Discord å®¢æˆ·ç«?¯å¢ƒè€Œå¼‚??,
            charTextColorTitle: "å­—ç¬¦?‡æœ¬é¢œè‰²",
            charTextStyleTitle: "å­—ç¬¦?‡æœ¬?·å¼",
            charBgColorTitle: "å­—ç¬¦?Œæ™¯é¢œè‰²"
          },
          message: "æ¶ˆæ¯",
          textColor: "?‡æœ¬é¢œè‰²",
          textStyle: "?‡æœ¬?·å¼",
          bgColor: "?Œæ™¯é¢œè‰²",
          default: "é»˜è?",
          black: "é»‘è‰²",
          red: "çº?‰²",
          green: "ç»¿è‰²",
          yellow: "é»„è‰²",
          blue: "?è‰²",
          purple: "ç´«è‰²",
          cyan: "?’è‰²",
          white: "?½è‰²",
          none: "??,
          bold: "ç²—ä½“",
          underline: "ä¸‹åˆ’çº?,
          apply: "åº”ç”¨",
          generate: "?Ÿæˆ",
          copy: "å¤åˆ¶",
          copied: "å·²å¤?¶ï¼",
          selectedRange: "?‰å®š?„æ–‡?¬èŒƒ??,
          applyTo: "åº”ç”¨??,
          clear: "æ¸…é™¤"
        },
        imageToBase64: {
          title: "?¾ç‰‡è½¬Base64",
          description: "å°†å›¾?‡è½¬?¢ä¸ºBase64?¼å¼",
          page: {
            converterTitle: "?¾ç‰‡è½?Base64 è½¬æ¢??,
            uploadImage: "ä¸Šä¼ ?¾ç‰‡",
            base64Output: "Base64 è¾“å‡º",
            copyBase64: "å¤åˆ¶ Base64",
            copyImgSrc: "å¤åˆ¶ <img src>",
            copyCssUrl: "å¤åˆ¶ CSS url()"
          }
        },
        kakaomapCoordOpener: {
          title: "KakaoMap?æ ‡?“å???,
          description: "?¨KakaoMapä¸?‰“å¼€?æ ‡"
        },
        llmVramCalculator: {
          title: "LLM VRAMè®¡ç®—??,
          description: "è®¡ç®—LLM?„VRAM?€æ±?
        },
        ntripScanner: {
          title: "NTRIP?«æ??,
          description: "?«æNTRIPå¹¿æ’­?¨ä»¥?¥æ‰¾??”¨æµ?,
          page: {
            title: "NTRIP?«æ??,
            casterIp: "Caster IP",
            port: "ç«?£",
            id: "ID",
            password: "å¯†ç ",
            hostPlaceholder: "ä¾‹å¦‚ï¼?27.0.0.1",
            portPlaceholder: "ä¾‹å¦‚ï¼?101",
            scanStart: "å¼€å§‹æ‰«??,
            scanning: "?«æä¸?..",
            mountPointList: "?‚è½½?¹åˆ—è¡?,
            unknownError: "?‘ç”Ÿ?ªçŸ¥?™è???,
            connectionFailed: "è¿æ¥å¤±è´¥??
          }
        },
        opticalPuyoReader: {
          title: "?‰å?Puyoè¯»å–??,
          description: "ä»å›¾?ä¸­è¯»å–Puyoæ¸¸æˆ??,
          uploadTip: "ä¸Šä¼ Puyoæ£‹ç›˜?ªå›¾?‚ç³»ç»Ÿä¼š?ªåŠ¨è¯†åˆ«6x12æ£‹ç›˜??,
          uploadPngImageAriaLabel: "Upload PNG image",
          uploadedImageAlt: "Uploaded image",
          originalColors: "?Ÿå§‹é¢œè‰²",
          categorizedColors: "?†ç±»?é¢œ??,
          row: "è¡?,
          column: "??,
          empty: "ç©?,
          colorSnapSensitivity: "é¢œè‰²?¸é™„?µæ•åº?,
          chainSimulatorLink: "è¿é”æ¨¡æ‹Ÿ??,
          openInChainSimulator: "?¨è¿?æ¨¡?Ÿå™¨ä¸?‰“å¼€"
        },
        videoCutterEncoder: {
          title: "è§†é¢‘?ªåˆ‡ç¼–ç ??,
          description: "?ªåˆ‡?Œç¼–?è§†é¢‘ç‰‡æ®?,
          page: {
            selectVideo: "?‰æ‹©è§†é¢‘",
            chooseVideoFile: "?‰æ‹©è§†é¢‘?‡ä»¶",
            selected: "å·²é€‰æ‹©",
            originalVideo: "?Ÿå§‹è§†é¢‘",
            trimRange: "?ªåˆ‡?ƒå›´",
            start: "å¼€å§?,
            end: "ç»“æŸ",
            enableSizeLimit: "??”¨å¤§å°?åˆ¶",
            selectSizeLimit: "?‰æ‹©å¤§å°?åˆ¶",
            custom: "?ªå®šä¹?,
            processing: "å¤„ç†ä¸?..",
            process: "å¤„ç†",
            trimmedVideo: "?ªåˆ‡?çš„è§†é¢‘",
            downloadTrimmedVideo: "ä¸‹è½½?ªåˆ‡?çš„è§†é¢‘",
            fixVideoReEncode: "ä¿?¤è§†é¢‘ï¼ˆé‡?°ç¼–?ï¼‰",
            lowQualitySmallSize: "ä½è´¨?ï¼ˆå°å°ºå¯¸ï¼‰",
            formatRequiresReencoding: "æ­¤æ ¼å¼é?è¦é‡?°ç¼–??,
            sizeLimitRequiresReencoding: "å¤§å°?åˆ¶?€è¦é‡?°ç¼–?ã€‚ç¦?¨ä»¥å¿«é€Ÿå¤„?†ã€?,
            processFastTrim: "å°†å¿«?Ÿå‰ª?‡è€Œä¸?æ–°ç¼–ç ?‚å¦‚?œè§†é¢‘æœ‰??¢˜ï¼Œè?ä½¿ç”¨ä¿?¤?‰é¡¹??,
            formatRequiresReencodingLonger: "æ­¤æ ¼å¼é?è¦é‡?°ç¼–?ã€‚å¤„?†å¯?½é?è¦æ›´?¿æ—¶?´ã€?,
            loadingFFmpeg: "æ­£åœ¨? è½½FFmpeg?¸å¿ƒ...",
            ffmpegLoaded: "FFmpeg? è½½?åŠŸï¼?,
            ffmpegNotLoaded: "FFmpegæ¨¡å—å°šæœª? è½½...",
            writingFile: "æ­£åœ¨å°†æ–‡ä»¶å†™?¥FFmpeg...",
            fileTooBig: "?‡ä»¶å¤ªå¤§ï¼Œæ— æ³•åœ¨æµè§ˆ?¨ä¸­å¤„ç†?‚æ?å¤§å¤§å°ä¸º2GB??,
            trimmingFast: "æ­£åœ¨?ªåˆ‡è§†é¢‘ï¼ˆå¿«?Ÿæ¨¡å¼ï¼‰...",
            trimmingPrecise: "æ­£åœ¨?ªåˆ‡è§†é¢‘ï¼ˆç²¾ç¡?¨¡å¼ï¼‰...",
            trimmingLowQuality: "æ­£åœ¨?ªåˆ‡è§†é¢‘ï¼ˆä½è´¨é‡æ¨¡å¼ï¼?..",
            invalidSizeLimit: "? æ•ˆ?„å¤§å°é™?¶ã€‚å¿…é¡»è‡³å°‘ä¸º1MB??,
            targetSizeTooSmall: "?? ‡å¤§å°å¯¹äº?€?‰æ—¶?¿å¤ªå°ã€‚è??‰æ‹©?´å¤§?„å¤§å°æˆ–?´çŸ­?„æ—¶?¿ã€?,
            targetSizeSmaller: "?? ‡å¤§å°å°äºé¢„ä¼°?‚æ??¨é‡?°ç¼–??..",
            targetSizeLarger: "?? ‡å¤§å°å¤§äºé¢„ä¼°?‚ä½¿?¨ç²¾ç¡?‰ª?‡ä»¥ä¿æŒè´¨é‡...",
            readingResult: "æ­£åœ¨è¯»å–ç»“æœ...",
            done: "å®Œæˆï¼?,
            memoryError: "?…å­˜?™è?ï¼šè?å°è¯•ä½¿ç”¨è¾ƒå°?„è§†é¢‘ç‰‡æ®µæˆ–?ä½è´¨é‡è®¾ç½®??,
            errorProcessing: "è§†é¢‘å¤„ç†?™è?",
            selectedFile: "å·²é€‰æ‹©?‡ä»¶",
            current: "å½“å‰",
            limitOutputFileSize: "?åˆ¶è¾“å‡º?‡ä»¶å¤§å°",
            mbPlaceholder: "MB",
            fixHighQuality: "ä¿?¤è§†é¢‘ï¼ˆé«˜è´¨é‡ï¼?,
            fixLowQuality: "ä¿?¤è§†é¢‘ï¼ˆä½è´¨é‡ï¼?,
            largeFileWarning: "å¤§æ–‡ä»¶å¯?½é?è¦æ›´?¿å¤„?†æ—¶?´ã€?,
            errorOccurred: "?‘ç”Ÿ?™è???
          }
        },
        tetrioReplayEditor: {
          title: "Tetrio?æ”¾ç¼–è¾‘??,
          description: "ç¼–è¾‘Tetrio?æ”¾?‡ä»¶"
        },
        qrCode: {
          title: "äºŒç»´??,
          description: "?Ÿæˆ?Œè??–äºŒç»´ç ",
          placeholder: "è¾“å…¥?‡æœ¬ä»¥ç”Ÿ?äºŒç»´ç ",
          tabGenerate: "?Ÿæˆ",
          tabRead: "è¯»å–",
          generateTitle: "?ŸæˆäºŒç»´??,
          readTitle: "è¯»å–äºŒç»´??,
          pasteFromClipboard: "ä»å‰ªè´´æ¿ç²˜è´´ (Ctrl+V)",
          orUploadFile: "?–ä¸Šä¼ äºŒç»´ç ?¾ç‰‡",
          uploadFile: "ä¸Šä¼ ?¾ç‰‡",
          decodedResult: "è¯†åˆ«ç»“æœ",
          copyResult: "å¤åˆ¶",
          copied: "å·²å¤?¶ï¼",
          noQrFound: "?¨å›¾?‡ä¸­?ªæ‰¾?°äºŒç»´ç ??,
          pasteHint: "?‰Ctrl+Vç²˜è´´?ªè´´?¿ä¸­?„äºŒç»´ç ?¾ç‰‡",
          dragDropHint: "?–å°†?¾ç‰‡?–æ”¾?°æ?å¤?,
          downloadQr: "ä¸‹è½½äºŒç»´??,
          previewAlt: "?Ÿæˆ?„äºŒç»´ç é¢„è§ˆ"
        }
      }
    }
  }
};

export type Language = keyof typeof translations;
export type TranslationKeys = typeof translations.en;
