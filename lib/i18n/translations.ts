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
              thisYear: "This year"
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
                occurrences: "Occurrences"
              }
            },
            hourlyActiveUsers: "Hourly active users (unique users)",
            hourlyMessageActivity: "Hourly messages count",
            userActivityRankingTitle: "User activity ranking (message count)",
            topMessagesTitle: "Most frequent messages ranking",
            topMessagesDescription: "Ranking table + donut chart",
            donutChartAriaLabel: "Message frequency donut chart"
          }
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
            openButton: "Open in KakaoMap"
          }
        },
        llmVramCalculator: {
          title: "LLM VRAM Calculator",
          description: "Calculate VRAM requirements for LLMs",
          errors: {
            enterModelId: "Please enter a model ID.",
            unauthorized: "Unauthorized. Check your token permissions.",
            forbidden: "Forbidden. You do not have access to this model.",
            modelConfigNotFound: "Model config was not found.",
            fetchConfigFailed: "Failed to fetch model config:",
            incompleteConfig: "Model config is incomplete.",
            fetchModelSizeManual: "Could not fetch model size automatically. Please enter it manually.",
            fetchModelSizeError: "Failed to fetch model size from API.",
            unknownFetchError: "Unknown error while fetching model information.",
            invalidModelSize: "Invalid model size.",
            invalidGGUFQuant: "Invalid weight quantization value.",
            invalidContextLength: "Invalid context length.",
            invalidKVQuant: "Invalid KV cache quantization value.",
            invalidOverhead: "Invalid overhead value.",
            invalidHeadDimension: "Invalid head dimension from model config."
          },
          page: {
            title: "LLM VRAM Calculator (GGUF Estimate)",
            description: "Estimate VRAM usage including model weights, KV cache, buffers, and overhead.",
            alertTitleError: "Error",
            loading: "Loading...",
            loadModelInfo: "Load Model Info",
            labels: {
              modelId: "Model ID (Hugging Face)",
              hfToken: "HF Token (optional)",
              modelSize: "Model size (B params)",
              batchSize: "Batch size",
              contextLength: "Context length",
              quantWeight: "Weight quantization (GGUF)",
              quantKV: "KV cache quantization",
              overhead: "Extra overhead (GB)"
            },
            placeholders: {
              modelId: "e.g. Qwen/Qwen3-0.6B",
              hfToken: "hf_xxx (optional)",
              modelSize: "e.g. 0.6",
              batchSize: "e.g. 512",
              quantWeight: "Select GGUF quantization",
              quantKV: "Select KV cache quantization",
              overhead: "e.g. 0.5"
            },
            descriptions: {
              hfTokenHelp: "Use token only for gated/private models.",
              modelSize: "Use billions of parameters (B).",
              modelSizeFailed: " Auto-fetch failed, please input manually.",
              batchSize: "Used for input/compute buffer estimation.",
              contextLength: "Used for KV cache size estimation.",
              quantWeight: "Bits-per-weight used for model weight memory.",
              quantKV: "Bit-width used for KV cache memory.",
              overhead: "Additional runtime/system overhead in GB."
            },
            status: {
              fetched: "Auto-fetched",
              fetchFailed: "Auto-fetch failed",
              fetching: "Fetching...",
              loadOrEnter: "Load or enter manually"
            },
            results: {
              title: "Estimated VRAM Breakdown",
              modelWeights: "Model Weights:",
              kvCache: "KV Cache:",
              inputBuffer: "Input Buffer:",
              computeBuffer: "Compute Buffer:",
              overhead: "Overhead:",
              total: "Estimated Total:"
            },
            messages: {
              loadingData: "Loading model data...",
              calculationFailedPrefix: "Calculation unavailable: ",
              startPrompt: "Load model info to start estimation.",
              validModelSizePrompt: "Enter a valid model size to continue.",
              calculating: "Calculating..."
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
          uploadedImageAlt: "Uploaded board image",
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
            invalidJson: "Invalid JSON format.",
            save: "Save",
            cancel: "Cancel",
            edit: "Edit",
            invalidFile: "Invalid file type. Please upload .ttrm, .ttr, or .json file.",
            download: "Download",
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
      title: "웹 유틸리티",
      subtitle: "유용한 도구 및 유틸리티 모음",
      backToCategories: "카테고리로 돌아가기",
      header: {
        themeToggleAriaLabel: "테마 전환",
        languages: {
          en: "영어",
          ko: "한국어",
          ja: "일본어",
          zh: "중국어"
        }
      },
      categories: {
        database: {
          title: "데이터베이스",
          description: "JSON, CSV, SQL 데이터베이스 작업 도구"
        },
        game: {
          title: "게임",
          description: "다양한 게임 유틸리티"
        },
        imageVideo: {
          title: "이미지 및 비디오",
          description: "비디오 및 이미지 편집 도구"
        },
        llm: {
          title: "LLM",
          description: "대규모 언어 모델 도구"
        },
        geolocation: {
          title: "위치정보",
          description: "지리 데이터 작업 도구"
        },
        etc: {
          title: "기타",
          description: "기타 유틸리티"
        }
      },
      tools: {
        escapedStringDecoder: {
          title: "이스케이프 문자열 디코더",
          description: "이스케이프된 문자열 디코딩",
          page: {
            inputLabel: "이스케이프 문자열",
            inputPlaceholder: "이스케이프 텍스트를 입력하세요 (예: \"\\uAD00\")",
            convert: "변환",
            outputLabel: "변환된 텍스트",
            errorPrefix: "오류"
          }
        },
        xlsxToSql: {
          title: "XLSX → SQL",
          description: "엑셀 파일을 SQL 문으로 변환",
          page: {
            converterTitle: "XLSX → SQL 변환기",
            uploadXlsxFile: "XLSX 파일 업로드",
            generatedSqlStatements: "생성된 SQL 문",
            copyToClipboard: "클립보드에 복사"
          }
        },
        csvSorter: {
          title: "CSV 정렬기",
          description: "CSV 데이터를 열 기준으로 정렬",
          page: {
            title: "고급 CSV 정렬기",
            labels: {
              sortColumn: "정렬 열",
              columnPosition: "열 위치",
              secondaryColumns: "보조 정렬 열",
              sortOrder: "정렬 순서",
              sortMethod: "정렬 방법",
              caseSensitiveSort: "대소문자 구분 정렬",
              handleMissing: "누락값 처리",
              customMissingValue: "사용자 지정 누락값",
              deleteComments: "주석 삭제",
              commentSymbol: "주석 기호",
              deleteEmptyLines: "빈 줄 삭제"
            },
            placeholders: {
              selectColumn: "열 선택",
              secondaryColumns: "예: column1, column2",
              selectOrder: "순서 선택",
              selectMethod: "방법 선택",
              selectMethodForMissing: "방법 선택"
            },
            sortOrderOptions: {
              asc: "오름차순",
              desc: "내림차순"
            },
            sortMethodOptions: {
              alphabetical: "사전순",
              numeric: "숫자"
            },
            missingValueOptions: {
              unchanged: "변경 없음",
              blank: "빈값",
              custom: "사용자 지정"
            },
            downloadButton: "정렬된 CSV 다운로드",
            messages: {
              showingPrefix: "총",
              showingSuffix: "행 중 앞의 10개 표시"
            }
          }
        },
        boothAlgorithmMultiplier: {
          title: "부스 알고리즘 곱셈기",
          description: "부스 알고리즘을 사용한 이진 곱셈",
          page: {
            title: "부스 알고리즘 곱셈기",
            labels: {
              multiplicand: "피승수 M (-8 ~ 7):",
              multiplier: "승수 Q (-8 ~ 7):"
            },
            calculate: "계산",
            resultsTitle: "결과",
            finalTitle: "계산 결과",
            productLabel: "곱: ",
            headers: {
              step: "단계",
              operation: "연산",
              q: "q0"
            },
            rangeError: "입력값은 -8에서 7 사이여야 합니다."
          }
        },
        kakaotalkChatAnalyzer: {
          title: "카카오톡 채팅 분석기",
          description: "카카오톡 로그로 순위와 시간대별 활동을 분석",
          page: {
            chatFileLabel: "채팅 로그 파일 업로드",
            pasteLabel: "또는 채팅 텍스트 직접 붙여넣기",
            rawTextPlaceholder: "[닉네임] [09:12] 메시지",
            parsingText: "파싱 중...",
            analyzeButton: "분석 시작",
            sampleFormat: "예시 형식: [이름] [오전 10:12] 메시지",
            parsedMessagesCount: "파싱된 메시지 수:",
            targetMessagesCount: "현재 대상 메시지 수:",
            preset: {
              all: "전체",
              last7: "최근 7일",
              last30: "최근 30일",
              thisYear: "올해"
            },
            startDateLabel: "시작 날짜",
            endDateLabel: "종료 날짜",
            openPicker: "열기",
            datePickerMin: "최소",
            datePickerMax: "최대",
            datePickerClose: "닫기",
            userHourlySection: "사용자별 시간대 활동",
            nicknameLabel: "사용자 선택",
            nicknameSearchPlaceholder: "사용자 검색 (부분 일치)",
            searchingNickname: "검색 중...",
            noNickname: "선택 안 함",
            totalUniqueUsers: "전체 고유 사용자",
            people: "명",
            noSearchResult: "검색 결과가 없습니다.",
            selectedUserHourlyTitle: "시간대 활동(메시지 수)",
            selectedUserTopMessagesTitle: "자주 보낸 메시지 유형",
            noMessageData: "메시지 데이터가 없습니다.",
            table: {
              head: {
                rank: "순위",
                message: "메시지",
                count: "횟수",
                nickname: "닉네임",
                messageCount: "메시지 수",
                occurrences: "등장 횟수"
              }
            },
            hourlyActiveUsers: "시간대별 활성 사용자(고유 사용자)",
            hourlyMessageActivity: "시간대별 메시지 수",
            userActivityRankingTitle: "사용자 활동 순위(메시지 수)",
            topMessagesTitle: "자주 등장한 메시지 순위",
            topMessagesDescription: "순위 테이블 + 도넛 차트",
            donutChartAriaLabel: "메시지 빈도 도넛 차트"
          }
        },
        discordColorMessageGenerator: {
          title: "디스코드 컬러 메시지 생성기",
          description: "디스코드용 컬러 메시지 생성",
          page: {
            inputPlaceholder: "메시지를 입력하세요...",
            selectedRangeApply: "선택 범위에 적용",
            styleLabel: "스타일",
            cancel: "취소",
            charStylePicker: "문자 스타일 선택기",
            noTextColor: "글자색 없음",
            noBgColor: "배경색 없음",
            generateAndCopy: "생성 후 복사",
            preview: "미리보기",
            howToTitle: "사용 방법",
            step1: "메시지를 입력합니다.",
            step2: "적용할 텍스트 범위를 선택합니다.",
            step3: "글자색, 글자 스타일, 배경색을 선택합니다.",
            step4: "선택 범위에 스타일을 적용합니다.",
            step5: "생성 후 복사를 눌러 결과를 복사합니다.",
            step6: "Discord 코드 블록에 붙여넣어 사용합니다.",
            note: "Discord 클라이언트 환경에 따라 색상 표시가 다를 수 있습니다.",
            charTextColorTitle: "문자 글자색",
            charTextStyleTitle: "문자 글자 스타일",
            charBgColorTitle: "문자 배경색"
          },
          message: "메시지",
          textColor: "글자 색상",
          textStyle: "글자 스타일",
          bgColor: "배경 색상",
          default: "기본값",
          black: "검정",
          red: "빨강",
          green: "초록",
          yellow: "노랑",
          blue: "파랑",
          purple: "보라",
          cyan: "청록",
          white: "흰색",
          none: "없음",
          bold: "굵게",
          underline: "밑줄",
          apply: "적용",
          generate: "생성",
          copy: "복사",
          copied: "복사됨!",
          selectedRange: "선택된 텍스트 범위",
          applyTo: "적용 대상",
          clear: "지우기"
        },
        imageToBase64: {
          title: "이미지 → Base64",
          description: "이미지를 Base64 형식으로 변환",
          page: {
            converterTitle: "이미지 → Base64 변환기",
            uploadImage: "이미지 업로드",
            base64Output: "Base64 출력",
            copyBase64: "Base64 복사",
            copyImgSrc: "<img src> 복사",
            copyCssUrl: "CSS url() 복사"
          }
        },
        kakaomapCoordOpener: {
          title: "카카오맵 좌표 열기",
          description: "카카오맵에서 좌표 열기",
          page: {
            description: "위도/경도를 입력하고 카카오맵에서 바로 좌표를 엽니다.",
            latitudeLabel: "위도",
            longitudeLabel: "경도",
            openButton: "카카오맵에서 열기"
          }
        },
        llmVramCalculator: {
          title: "LLM VRAM 계산기",
          description: "LLM의 VRAM 요구사항 계산",
          errors: {
            enterModelId: "모델 ID를 입력하세요.",
            unauthorized: "인증에 실패했습니다. 토큰 권한을 확인하세요.",
            forbidden: "접근 권한이 없습니다.",
            modelConfigNotFound: "모델 설정 파일을 찾을 수 없습니다.",
            fetchConfigFailed: "모델 설정을 불러오지 못했습니다:",
            incompleteConfig: "모델 설정 정보가 불완전합니다.",
            fetchModelSizeManual: "모델 크기를 자동으로 가져오지 못했습니다. 수동으로 입력하세요.",
            fetchModelSizeError: "API에서 모델 크기 조회에 실패했습니다.",
            unknownFetchError: "모델 정보를 가져오는 중 알 수 없는 오류가 발생했습니다.",
            invalidModelSize: "모델 크기 값이 올바르지 않습니다.",
            invalidGGUFQuant: "가중치 양자화 값이 올바르지 않습니다.",
            invalidContextLength: "컨텍스트 길이 값이 올바르지 않습니다.",
            invalidKVQuant: "KV 캐시 양자화 값이 올바르지 않습니다.",
            invalidOverhead: "오버헤드 값이 올바르지 않습니다.",
            invalidHeadDimension: "모델 설정의 헤드 차원 값이 올바르지 않습니다."
          },
          page: {
            title: "LLM VRAM 계산기 (GGUF 추정)",
            description: "모델 가중치, KV 캐시, 버퍼, 오버헤드를 포함한 VRAM 사용량을 추정합니다.",
            alertTitleError: "오류",
            loading: "로딩 중...",
            loadModelInfo: "모델 정보 불러오기",
            labels: {
              modelId: "모델 ID (Hugging Face)",
              hfToken: "HF 토큰 (선택)",
              modelSize: "모델 크기 (B 파라미터)",
              batchSize: "배치 크기",
              contextLength: "컨텍스트 길이",
              quantWeight: "가중치 양자화 (GGUF)",
              quantKV: "KV 캐시 양자화",
              overhead: "추가 오버헤드 (GB)"
            },
            placeholders: {
              modelId: "예: Qwen/Qwen3-0.6B",
              hfToken: "hf_xxx (선택)",
              modelSize: "예: 0.6",
              batchSize: "예: 512",
              quantWeight: "GGUF 양자화 선택",
              quantKV: "KV 캐시 양자화 선택",
              overhead: "예: 0.5"
            },
            descriptions: {
              hfTokenHelp: "게이트/비공개 모델일 때만 토큰이 필요합니다.",
              modelSize: "단위는 B(10억 파라미터)입니다.",
              modelSizeFailed: " 자동 조회에 실패했습니다. 수동으로 입력하세요.",
              batchSize: "입력/연산 버퍼 추정에 사용됩니다.",
              contextLength: "KV 캐시 크기 추정에 사용됩니다.",
              quantWeight: "모델 가중치 메모리 계산에 사용되는 비트/가중치 값입니다.",
              quantKV: "KV 캐시 메모리 계산에 사용되는 비트 폭입니다.",
              overhead: "런타임/시스템 추가 오버헤드(GB)입니다."
            },
            status: {
              fetched: "자동 조회됨",
              fetchFailed: "자동 조회 실패",
              fetching: "조회 중...",
              loadOrEnter: "불러오거나 직접 입력"
            },
            results: {
              title: "예상 VRAM 상세",
              modelWeights: "모델 가중치:",
              kvCache: "KV 캐시:",
              inputBuffer: "입력 버퍼:",
              computeBuffer: "연산 버퍼:",
              overhead: "오버헤드:",
              total: "예상 총합:"
            },
            messages: {
              loadingData: "모델 데이터를 불러오는 중...",
              calculationFailedPrefix: "계산 불가: ",
              startPrompt: "모델 정보를 불러오면 계산이 시작됩니다.",
              validModelSizePrompt: "유효한 모델 크기를 입력하세요.",
              calculating: "계산 중..."
            }
          }
        },
        ntripScanner: {
          title: "NTRIP 스캐너",
          description: "NTRIP 캐스터에서 사용 가능한 스트림 검색",
          page: {
            title: "NTRIP 스캐너",
            casterIp: "캐스터 IP",
            port: "포트",
            id: "ID",
            password: "비밀번호",
            hostPlaceholder: "예: 127.0.0.1",
            portPlaceholder: "예: 2101",
            scanStart: "스캔 시작",
            scanning: "스캔 중...",
            mountPointList: "마운트포인트 목록",
            unknownError: "알 수 없는 오류가 발생했습니다.",
            connectionFailed: "연결에 실패했습니다."
          }
        },
        opticalPuyoReader: {
          title: "이미지 인식 뿌요 리더",
          description: "이미지에서 뿌요 게임 보드 읽기",
          uploadTip: "뿌요 보드 스크린샷을 업로드하세요. 6x12 보드를 자동 인식합니다.",
          originalColors: "원본 색상",
          categorizedColors: "분류된 색상",
          row: "행",
          column: "열",
          empty: "빈칸",
          colorSnapSensitivity: "색상 스냅 민감도",
          chainSimulatorLink: "연쇄 시뮬레이터",
          openInChainSimulator: "연쇄 시뮬레이터에서 열기"
        },
        videoCutterEncoder: {
          title: "비디오 커터 인코더",
          description: "비디오 세그먼트 자르기 및 인코딩",
          page: {
            selectVideo: "비디오 선택",
            chooseVideoFile: "비디오 파일 선택",
            selected: "선택됨",
            originalVideo: "원본 비디오",
            trimRange: "자르기 범위",
            start: "시작",
            end: "끝",
            enableSizeLimit: "크기 제한 사용",
            selectSizeLimit: "크기 제한 선택",
            custom: "사용자 지정",
            processing: "처리 중...",
            process: "처리",
            trimmedVideo: "자른 비디오",
            downloadTrimmedVideo: "자른 비디오 다운로드",
            fixVideoReEncode: "비디오 수정 (재인코딩)",
            lowQualitySmallSize: "저품질 (작은 크기)",
            formatRequiresReencoding: "이 형식은 재인코딩이 필요합니다",
            sizeLimitRequiresReencoding: "크기 제한은 재인코딩이 필요합니다. 빠른 처리를 위해 비활성화하세요.",
            processFastTrim: "재인코딩 없이 빠르게 자릅니다. 비디오에 문제가 있으면 수정 옵션을 사용하세요.",
            formatRequiresReencodingLonger: "이 형식은 재인코딩이 필요합니다. 처리 시간이 더 걸릴 수 있습니다.",
            loadingFFmpeg: "FFmpeg 코어 로딩 중...",
            ffmpegLoaded: "FFmpeg가 성공적으로 로드되었습니다!",
            ffmpegNotLoaded: "FFmpeg 모듈이 아직 로드되지 않았습니다...",
            writingFile: "FFmpeg에 파일 쓰는 중...",
            fileTooBig: "파일이 너무 커서 브라우저에서 처리할 수 없습니다. 최대 크기는 2GB입니다.",
            trimmingFast: "비디오 자르는 중 (빠른 모드)...",
            trimmingPrecise: "비디오 자르는 중 (정밀 모드)...",
            trimmingLowQuality: "비디오 자르는 중 (저품질 모드)...",
            invalidSizeLimit: "잘못된 크기 제한입니다. 최소 1MB 이상이어야 합니다.",
            targetSizeTooSmall: "대상 크기가 선택한 길이에 비해 너무 작습니다. 더 큰 크기나 짧은 길이를 선택하세요.",
            targetSizeSmaller: "대상 크기가 예상보다 작습니다. 재인코딩 중...",
            targetSizeLarger: "대상 크기가 예상보다 큽니다. 품질 유지를 위해 정밀 자르기 사용 중...",
            readingResult: "결과 읽는 중...",
            done: "완료!",
            memoryError: "메모리 오류: 더 작은 비디오 세그먼트를 사용하거나 품질 설정을 낮추세요.",
            errorProcessing: "비디오 처리 오류",
            selectedFile: "선택한 파일",
            current: "현재",
            limitOutputFileSize: "출력 파일 크기 제한",
            mbPlaceholder: "MB",
            fixHighQuality: "비디오 수정 (고품질)",
            fixLowQuality: "비디오 수정 (저품질)",
            largeFileWarning: "큰 파일은 처리 시간이 오래 걸릴 수 있습니다.",
            errorOccurred: "오류가 발생했습니다."
          }
        },
        tetrioReplayEditor: {
          title: "테트리오 리플레이 편집기",
          description: "테트리오 리플레이 파일 편집"
        },
        qrCode: {
          title: "QR코드",
          description: "QR코드 생성 및 인식",
          placeholder: "QR 코드를 생성할 텍스트를 입력하세요",
          tabGenerate: "생성",
          tabRead: "인식",
          generateTitle: "QR코드 생성",
          readTitle: "QR코드 인식",
          pasteFromClipboard: "클립보드에서 붙여넣기 (Ctrl+V)",
          orUploadFile: "또는 QR코드 이미지 업로드",
          uploadFile: "이미지 업로드",
          decodedResult: "인식 결과",
          copyResult: "복사",
          copied: "복사됨!",
          noQrFound: "이미지에서 QR코드를 찾을 수 없습니다.",
          pasteHint: "Ctrl+V로 클립보드의 QR코드 이미지를 붙여넣으세요",
          dragDropHint: "또는 이미지를 여기에 드래그 & 드롭",
          downloadQr: "QR코드 다운로드",
          previewAlt: "생성된 QR코드 미리보기"
        }
      }
    }
  },
  ja: {
    common: {
      title: "ウェブユーティリティ",
      subtitle: "便利なツールとユーティリティのコレクション",
      backToCategories: "カテゴリーに戻る",
      header: {
        themeToggleAriaLabel: "テーマ切替",
        languages: {
          en: "英語",
          ko: "韓国語",
          ja: "日本語",
          zh: "中国語"
        }
      },
      categories: {
        database: {
          title: "データベース",
          description: "JSON、CSV、SQLデータベース操作ツール"
        },
        game: {
          title: "ゲーム",
          description: "様々なゲームユーティリティ"
        },
        imageVideo: {
          title: "画像・動画",
          description: "動画と画像の編集ツール"
        },
        llm: {
          title: "LLM",
          description: "大規模言語モデルツール"
        },
        geolocation: {
          title: "位置情報",
          description: "地理データ操作ツール"
        },
        etc: {
          title: "その他",
          description: "その他のユーティリティ"
        }
      },
      tools: {
        escapedStringDecoder: {
          title: "エスケープ文字列デコーダー",
          description: "エスケープされた文字列をデコード",
          page: {
            inputLabel: "エスケープ文字列",
            inputPlaceholder: "エスケープテキストを入力してください（例: \"\\uAD00\"）",
            convert: "変換",
            outputLabel: "変換されたテキスト",
            errorPrefix: "エラー"
          }
        },
        xlsxToSql: {
          title: "XLSX → SQL",
          description: "ExcelファイルをSQL文に変換",
          page: {
            converterTitle: "XLSX → SQL 変換",
            uploadXlsxFile: "XLSXファイルをアップロード",
            generatedSqlStatements: "生成されたSQL文",
            copyToClipboard: "クリップボードにコピー"
          }
        },
        csvSorter: {
          title: "CSVソーター",
          description: "CSVデータを列でソート",
          page: {
            title: "高度なCSVソーター",
            labels: {
              sortColumn: "ソート列",
              columnPosition: "列位置",
              secondaryColumns: "第2ソート列",
              sortOrder: "ソート順",
              sortMethod: "ソート方法",
              caseSensitiveSort: "大文字小文字を区別",
              handleMissing: "欠損値の処理",
              customMissingValue: "カスタム欠損値",
              deleteComments: "コメントを削除",
              commentSymbol: "コメント記号",
              deleteEmptyLines: "空行を削除"
            },
            placeholders: {
              selectColumn: "列を選択",
              secondaryColumns: "例: column1, column2",
              selectOrder: "順序を選択",
              selectMethod: "方法を選択",
              selectMethodForMissing: "方法を選択"
            },
            sortOrderOptions: {
              asc: "昇順",
              desc: "降順"
            },
            sortMethodOptions: {
              alphabetical: "アルファベット順",
              numeric: "数値"
            },
            missingValueOptions: {
              unchanged: "変更なし",
              blank: "空白",
              custom: "カスタム"
            },
            downloadButton: "ソート済みCSVをダウンロード",
            messages: {
              showingPrefix: "全",
              showingSuffix: "行中、先頭10行を表示"
            }
          }
        },
        boothAlgorithmMultiplier: {
          title: "ブースアルゴリズム乗算器",
          description: "ブースアルゴリズムを使用したバイナリ乗算",
          page: {
            title: "ブースアルゴリズム乗算器",
            labels: {
              multiplicand: "被乗数 M (-8 ~ 7):",
              multiplier: "乗数 Q (-8 ~ 7):"
            },
            calculate: "計算",
            resultsTitle: "結果",
            finalTitle: "計算結果",
            productLabel: "積: ",
            headers: {
              step: "ステップ",
              operation: "演算",
              q: "q0"
            },
            rangeError: "入力値は -8 から 7 の範囲である必要があります。"
          }
        },
        kakaotalkChatAnalyzer: {
          title: "KakaoTalkチャット分析",
          description: "KakaoTalkログからランキングと時間帯別アクティビティを分析",
          page: {
            chatFileLabel: "チャットログファイルをアップロード",
            pasteLabel: "またはチャットテキストを直接貼り付け",
            rawTextPlaceholder: "[ニックネーム] [09:12] メッセージ",
            parsingText: "解析中...",
            analyzeButton: "分析開始",
            sampleFormat: "サンプル形式: [名前] [10:12 AM] メッセージ",
            parsedMessagesCount: "解析済みメッセージ数:",
            targetMessagesCount: "現在の対象メッセージ数:",
            preset: {
              all: "すべて",
              last7: "直近7日",
              last30: "直近30日",
              thisYear: "今年"
            },
            startDateLabel: "開始日",
            endDateLabel: "終了日",
            openPicker: "開く",
            datePickerMin: "最小",
            datePickerMax: "最大",
            datePickerClose: "閉じる",
            userHourlySection: "ユーザー別時間帯アクティビティ",
            nicknameLabel: "ユーザー選択",
            nicknameSearchPlaceholder: "ユーザー検索（部分一致）",
            searchingNickname: "検索中...",
            noNickname: "未選択",
            totalUniqueUsers: "ユニークユーザー総数",
            people: "人",
            noSearchResult: "検索結果がありません。",
            selectedUserHourlyTitle: "時間帯アクティビティ（メッセージ数）",
            selectedUserTopMessagesTitle: "よく使うメッセージ種類",
            noMessageData: "メッセージデータがありません。",
            table: {
              head: {
                rank: "順位",
                message: "メッセージ",
                count: "回数",
                nickname: "ニックネーム",
                messageCount: "メッセージ数",
                occurrences: "出現回数"
              }
            },
            hourlyActiveUsers: "時間帯別アクティブユーザー（ユニーク）",
            hourlyMessageActivity: "時間帯別メッセージ数",
            userActivityRankingTitle: "ユーザー活動ランキング（メッセージ数）",
            topMessagesTitle: "頻出メッセージランキング",
            topMessagesDescription: "ランキング表 + ドーナツチャート",
            donutChartAriaLabel: "メッセージ頻度ドーナツチャート"
          }
        },
        discordColorMessageGenerator: {
          title: "Discord カラーメッセージジェネレーター",
          description: "Discord用のカラーメッセージを生成",
          page: {
            inputPlaceholder: "メッセージを入力してください...",
            selectedRangeApply: "選択範囲に適用",
            styleLabel: "スタイル",
            cancel: "キャンセル",
            charStylePicker: "文字スタイルピッカー",
            noTextColor: "文字色なし",
            noBgColor: "背景色なし",
            generateAndCopy: "生成してコピー",
            preview: "プレビュー",
            howToTitle: "使い方",
            step1: "メッセージを入力します。",
            step2: "適用するテキスト範囲を選択します。",
            step3: "文字色、文字スタイル、背景色を選択します。",
            step4: "選択範囲にスタイルを適用します。",
            step5: "「生成してコピー」を押して結果をコピーします。",
            step6: "Discordのコードブロックに貼り付けて使用します。",
            note: "色の表示はDiscordのクライアント環境によって異なる場合があります。",
            charTextColorTitle: "文字の色",
            charTextStyleTitle: "文字スタイル",
            charBgColorTitle: "文字の背景色"
          },
          message: "メッセージ",
          textColor: "文字色",
          textStyle: "文字スタイル",
          bgColor: "背景色",
          default: "デフォルト",
          black: "黒",
          red: "赤",
          green: "緑",
          yellow: "黄",
          blue: "青",
          purple: "紫",
          cyan: "水色",
          white: "白",
          none: "なし",
          bold: "太字",
          underline: "下線",
          apply: "適用",
          generate: "生成",
          copy: "コピー",
          copied: "コピーしました！",
          selectedRange: "選択されたテキスト範囲",
          applyTo: "適用対象",
          clear: "クリア"
        },
        imageToBase64: {
          title: "画像 → Base64",
          description: "画像をBase64形式に変換",
          page: {
            converterTitle: "画像 → Base64 変換",
            uploadImage: "画像をアップロード",
            base64Output: "Base64出力",
            copyBase64: "Base64をコピー",
            copyImgSrc: "<img src> をコピー",
            copyCssUrl: "CSS url() をコピー"
          }
        },
        kakaomapCoordOpener: {
          title: "カカオマップ座標オープナー",
          description: "カカオマップで座標を開く",
          page: {
            description: "緯度・経度を入力してカカオマップで座標を直接開きます。",
            latitudeLabel: "緯度",
            longitudeLabel: "経度",
            openButton: "カカオマップで開く"
          }
        },
        llmVramCalculator: {
          title: "LLM VRAM計算機",
          description: "LLMのVRAM要件を計算",
          errors: {
            enterModelId: "モデルIDを入力してください。",
            unauthorized: "認証に失敗しました。トークン権限を確認してください。",
            forbidden: "アクセス権がありません。",
            modelConfigNotFound: "モデル設定ファイルが見つかりません。",
            fetchConfigFailed: "モデル設定の取得に失敗しました:",
            incompleteConfig: "モデル設定情報が不完全です。",
            fetchModelSizeManual: "モデルサイズを自動取得できませんでした。手動で入力してください。",
            fetchModelSizeError: "APIからモデルサイズを取得できませんでした。",
            unknownFetchError: "モデル情報の取得中に不明なエラーが発生しました。",
            invalidModelSize: "モデルサイズが無効です。",
            invalidGGUFQuant: "重み量子化値が無効です。",
            invalidContextLength: "コンテキスト長が無効です。",
            invalidKVQuant: "KVキャッシュ量子化値が無効です。",
            invalidOverhead: "オーバーヘッド値が無効です。",
            invalidHeadDimension: "モデル設定のヘッド次元が無効です。"
          },
          page: {
            title: "LLM VRAM計算機（GGUF推定）",
            description: "モデル重み、KVキャッシュ、バッファ、オーバーヘッドを含むVRAM使用量を推定します。",
            alertTitleError: "エラー",
            loading: "読み込み中...",
            loadModelInfo: "モデル情報を読み込む",
            labels: {
              modelId: "モデルID（Hugging Face）",
              hfToken: "HFトークン（任意）",
              modelSize: "モデルサイズ（Bパラメータ）",
              batchSize: "バッチサイズ",
              contextLength: "コンテキスト長",
              quantWeight: "重み量子化（GGUF）",
              quantKV: "KVキャッシュ量子化",
              overhead: "追加オーバーヘッド（GB）"
            },
            placeholders: {
              modelId: "例: Qwen/Qwen3-0.6B",
              hfToken: "hf_xxx（任意）",
              modelSize: "例: 0.6",
              batchSize: "例: 512",
              quantWeight: "GGUF量子化を選択",
              quantKV: "KVキャッシュ量子化を選択",
              overhead: "例: 0.5"
            },
            descriptions: {
              hfTokenHelp: "ゲート付き/非公開モデルの場合のみトークンが必要です。",
              modelSize: "単位はB（10億パラメータ）です。",
              modelSizeFailed: " 自動取得に失敗しました。手動で入力してください。",
              batchSize: "入力/計算バッファ推定に使用します。",
              contextLength: "KVキャッシュサイズ推定に使用します。",
              quantWeight: "モデル重みメモリ計算に使うビット/重み値です。",
              quantKV: "KVキャッシュメモリ計算に使うビット幅です。",
              overhead: "ランタイム/システム追加オーバーヘッド（GB）です。"
            },
            status: {
              fetched: "自動取得済み",
              fetchFailed: "自動取得失敗",
              fetching: "取得中...",
              loadOrEnter: "読み込むか手動入力"
            },
            results: {
              title: "推定VRAM内訳",
              modelWeights: "モデル重み:",
              kvCache: "KVキャッシュ:",
              inputBuffer: "入力バッファ:",
              computeBuffer: "計算バッファ:",
              overhead: "オーバーヘッド:",
              total: "推定合計:"
            },
            messages: {
              loadingData: "モデルデータを読み込み中...",
              calculationFailedPrefix: "計算不可: ",
              startPrompt: "モデル情報を読み込むと推定を開始できます。",
              validModelSizePrompt: "有効なモデルサイズを入力してください。",
              calculating: "計算中..."
            }
          }
        },
        ntripScanner: {
          title: "NTRIPスキャナー",
          description: "NTRIPキャスターで利用可能なストリームを検索",
          page: {
            title: "NTRIPスキャナー",
            casterIp: "キャスターIP",
            port: "ポート",
            id: "ID",
            password: "パスワード",
            hostPlaceholder: "例: 127.0.0.1",
            portPlaceholder: "例: 2101",
            scanStart: "スキャン開始",
            scanning: "スキャン中...",
            mountPointList: "マウントポイント一覧",
            unknownError: "不明なエラーが発生しました。",
            connectionFailed: "接続に失敗しました。"
          }
        },
        opticalPuyoReader: {
          title: "光学ぷよぷよリーダー",
          description: "画像からぷよぷよゲームボードを読み取る",
          uploadTip: "ぷよボードのスクリーンショットをアップロードしてください。6x12盤面を自動認識します。",
          originalColors: "元の色",
          categorizedColors: "分類後の色",
          row: "行",
          column: "列",
          empty: "空",
          colorSnapSensitivity: "色スナップ感度",
          chainSimulatorLink: "連鎖シミュレーター",
          openInChainSimulator: "連鎖シミュレーターで開く"
        },
        videoCutterEncoder: {
          title: "ビデオカッターエンコーダー",
          description: "ビデオセグメントのカットとエンコード",
          page: {
            selectVideo: "ビデオを選択",
            chooseVideoFile: "ビデオファイルを選択",
            selected: "選択済み",
            originalVideo: "オリジナルビデオ",
            trimRange: "トリム範囲",
            start: "開始",
            end: "終了",
            enableSizeLimit: "サイズ制限を有効にする",
            selectSizeLimit: "サイズ制限を選択",
            custom: "カスタム",
            processing: "処理中...",
            process: "処理",
            trimmedVideo: "トリムされたビデオ",
            downloadTrimmedVideo: "トリムされたビデオをダウンロード",
            fixVideoReEncode: "ビデオ修正（再エンコード）",
            lowQualitySmallSize: "低品質（小さいサイズ）",
            formatRequiresReencoding: "この形式は再エンコードが必要です",
            sizeLimitRequiresReencoding: "サイズ制限には再エンコードが必要です。高速処理のために無効にしてください。",
            processFastTrim: "再エンコードなしで高速にトリムします。ビデオに問題がある場合は修正オプションを使用してください。",
            formatRequiresReencodingLonger: "この形式は再エンコードが必要です。処理に時間がかかる場合があります。",
            loadingFFmpeg: "FFmpegコアをロード中...",
            ffmpegLoaded: "FFmpegが正常にロードされました！",
            ffmpegNotLoaded: "FFmpegモジュールがまだロードされていません...",
            writingFile: "FFmpegにファイルを書き込み中...",
            fileTooBig: "ファイルが大きすぎてブラウザで処理できません。最大サイズは2GBです。",
            trimmingFast: "ビデオをトリム中（高速モード）...",
            trimmingPrecise: "ビデオをトリム中（精密モード）...",
            trimmingLowQuality: "ビデオをトリム中（低品質モード）...",
            invalidSizeLimit: "無効なサイズ制限です。最小1MB以上である必要があります。",
            targetSizeTooSmall: "ターゲットサイズが選択した長さに対して小さすぎます。より大きいサイズまたは短い長さを選択してください。",
            targetSizeSmaller: "ターゲットサイズが推定より小さいです。再エンコード中...",
            targetSizeLarger: "ターゲットサイズが推定より大きいです。品質を保つために精密トリムを使用中...",
            readingResult: "結果を読み取り中...",
            done: "完了！",
            memoryError: "メモリエラー：より小さいビデオセグメントを使用するか、品質設定を下げてください。",
            errorProcessing: "ビデオ処理エラー",
            selectedFile: "選択したファイル",
            current: "現在",
            limitOutputFileSize: "出力ファイルサイズを制限",
            mbPlaceholder: "MB",
            fixHighQuality: "ビデオ修正（高品質）",
            fixLowQuality: "ビデオ修正（低品質）",
            largeFileWarning: "ファイルが大きい場合、処理に時間がかかることがあります。",
            errorOccurred: "エラーが発生しました。"
          }
        },
        tetrioReplayEditor: {
          title: "テトリオリプレイエディター",
          description: "テトリオリプレイファイルを編集"
        },
        qrCode: {
          title: "QRコード",
          description: "QRコードの生成と読み取り",
          placeholder: "QRコードを生成するテキストを入力してください",
          tabGenerate: "生成",
          tabRead: "読み取り",
          generateTitle: "QRコード生成",
          readTitle: "QRコード読み取り",
          pasteFromClipboard: "クリップボードから貼り付け (Ctrl+V)",
          orUploadFile: "またはQRコード画像をアップロード",
          uploadFile: "画像をアップロード",
          decodedResult: "読み取り結果",
          copyResult: "コピー",
          copied: "コピーしました！",
          noQrFound: "画像からQRコードが見つかりませんでした。",
          pasteHint: "Ctrl+VでクリップボードのQRコード画像を貼り付けてください",
          dragDropHint: "または画像をここにドラッグ＆ドロップ",
          downloadQr: "QRコードをダウンロード",
          previewAlt: "生成されたQRコードのプレビュー"
        }
      }
    }
  },
  zh: {
    common: {
      title: "网页工具",
      subtitle: "实用工具和实用程序集合",
      backToCategories: "返回分类",
      header: {
        themeToggleAriaLabel: "切换主题",
        languages: {
          en: "英语",
          ko: "韩语",
          ja: "日语",
          zh: "中文"
        }
      },
      categories: {
        database: {
          title: "数据库",
          description: "JSON、CSV、SQL数据库工具"
        },
        game: {
          title: "游戏",
          description: "各种游戏实用工具"
        },
        imageVideo: {
          title: "图片和视频",
          description: "视频和图像编辑工具"
        },
        llm: {
          title: "LLM",
          description: "大型语言模型工具"
        },
        geolocation: {
          title: "地理位置",
          description: "地理数据处理工具"
        },
        etc: {
          title: "其他",
          description: "其他实用工具"
        }
      },
      tools: {
        escapedStringDecoder: {
          title: "转义字符串解码器",
          description: "解码转义字符串",
          page: {
            inputLabel: "转义字符串",
            inputPlaceholder: "输入转义文本（例如：\"\\uAD00\"）",
            convert: "转换",
            outputLabel: "转换后的文本",
            errorPrefix: "错误"
          }
        },
        xlsxToSql: {
          title: "XLSX 转 SQL",
          description: "将Excel文件转换为SQL语句",
          page: {
            converterTitle: "XLSX 转 SQL 转换器",
            uploadXlsxFile: "上传 XLSX 文件",
            generatedSqlStatements: "生成的 SQL 语句",
            copyToClipboard: "复制到剪贴板"
          }
        },
        csvSorter: {
          title: "CSV排序器",
          description: "按列排序CSV数据",
          page: {
            title: "高级CSV排序器",
            labels: {
              sortColumn: "排序列",
              columnPosition: "列位置",
              secondaryColumns: "次级排序列",
              sortOrder: "排序顺序",
              sortMethod: "排序方法",
              caseSensitiveSort: "区分大小写排序",
              handleMissing: "缺失值处理",
              customMissingValue: "自定义缺失值",
              deleteComments: "删除注释",
              commentSymbol: "注释符号",
              deleteEmptyLines: "删除空行"
            },
            placeholders: {
              selectColumn: "选择列",
              secondaryColumns: "例如：column1, column2",
              selectOrder: "选择顺序",
              selectMethod: "选择方法",
              selectMethodForMissing: "选择方法"
            },
            sortOrderOptions: {
              asc: "升序",
              desc: "降序"
            },
            sortMethodOptions: {
              alphabetical: "字母顺序",
              numeric: "数字"
            },
            missingValueOptions: {
              unchanged: "不变",
              blank: "空白",
              custom: "自定义"
            },
            downloadButton: "下载已排序CSV",
            messages: {
              showingPrefix: "共",
              showingSuffix: "行，仅显示前10行"
            }
          }
        },
        boothAlgorithmMultiplier: {
          title: "Booth算法乘法器",
          description: "使用Booth算法进行二进制乘法",
          page: {
            title: "Booth算法乘法器",
            labels: {
              multiplicand: "被乘数 M (-8 ~ 7):",
              multiplier: "乘数 Q (-8 ~ 7):"
            },
            calculate: "计算",
            resultsTitle: "结果",
            finalTitle: "计算结果",
            productLabel: "乘积: ",
            headers: {
              step: "步骤",
              operation: "运算",
              q: "q0"
            },
            rangeError: "输入值必须在 -8 到 7 之间。"
          }
        },
        kakaotalkChatAnalyzer: {
          title: "KakaoTalk聊天分析器",
          description: "从KakaoTalk日志分析排名与分时活跃度",
          page: {
            chatFileLabel: "上传聊天日志文件",
            pasteLabel: "或直接粘贴聊天文本",
            rawTextPlaceholder: "[昵称] [09:12] 消息",
            parsingText: "解析中...",
            analyzeButton: "开始分析",
            sampleFormat: "示例格式: [姓名] [10:12 AM] 消息",
            parsedMessagesCount: "已解析消息数:",
            targetMessagesCount: "当前目标消息数:",
            preset: {
              all: "全部",
              last7: "最近7天",
              last30: "最近30天",
              thisYear: "今年"
            },
            startDateLabel: "开始日期",
            endDateLabel: "结束日期",
            openPicker: "打开",
            datePickerMin: "最小",
            datePickerMax: "最大",
            datePickerClose: "关闭",
            userHourlySection: "按用户分时活跃度",
            nicknameLabel: "选择用户",
            nicknameSearchPlaceholder: "搜索用户（部分匹配）",
            searchingNickname: "搜索中...",
            noNickname: "未选择",
            totalUniqueUsers: "唯一用户总数",
            people: "人",
            noSearchResult: "未找到结果。",
            selectedUserHourlyTitle: "分时活跃度（消息数）",
            selectedUserTopMessagesTitle: "高频消息类型",
            noMessageData: "暂无消息数据。",
            table: {
              head: {
                rank: "排名",
                message: "消息",
                count: "次数",
                nickname: "昵称",
                messageCount: "消息数",
                occurrences: "出现次数"
              }
            },
            hourlyActiveUsers: "分时活跃用户数（唯一用户）",
            hourlyMessageActivity: "分时消息数",
            userActivityRankingTitle: "用户活跃排名（消息数）",
            topMessagesTitle: "高频消息排名",
            topMessagesDescription: "排名表 + 环形图",
            donutChartAriaLabel: "消息频率环形图"
          }
        },
        discordColorMessageGenerator: {
          title: "Discord彩色消息生成器",
          description: "为Discord生成彩色消息",
          page: {
            inputPlaceholder: "请输入消息...",
            selectedRangeApply: "应用到选中范围",
            styleLabel: "样式",
            cancel: "取消",
            charStylePicker: "字符样式选择器",
            noTextColor: "无文本颜色",
            noBgColor: "无背景颜色",
            generateAndCopy: "生成并复制",
            preview: "预览",
            howToTitle: "使用方法",
            step1: "输入消息内容。",
            step2: "选择要应用的文本范围。",
            step3: "选择文本颜色、文本样式和背景颜色。",
            step4: "将样式应用到选中范围。",
            step5: "点击“生成并复制”复制结果。",
            step6: "粘贴到 Discord 代码块中使用。",
            note: "颜色显示效果可能因 Discord 客户端环境而异。",
            charTextColorTitle: "字符文本颜色",
            charTextStyleTitle: "字符文本样式",
            charBgColorTitle: "字符背景颜色"
          },
          message: "消息",
          textColor: "文本颜色",
          textStyle: "文本样式",
          bgColor: "背景颜色",
          default: "默认",
          black: "黑色",
          red: "红色",
          green: "绿色",
          yellow: "黄色",
          blue: "蓝色",
          purple: "紫色",
          cyan: "青色",
          white: "白色",
          none: "无",
          bold: "粗体",
          underline: "下划线",
          apply: "应用",
          generate: "生成",
          copy: "复制",
          copied: "已复制！",
          selectedRange: "选定的文本范围",
          applyTo: "应用到",
          clear: "清除"
        },
        imageToBase64: {
          title: "图片转Base64",
          description: "将图片转换为Base64格式",
          page: {
            converterTitle: "图片转 Base64 转换器",
            uploadImage: "上传图片",
            base64Output: "Base64 输出",
            copyBase64: "复制 Base64",
            copyImgSrc: "复制 <img src>",
            copyCssUrl: "复制 CSS url()"
          }
        },
        kakaomapCoordOpener: {
          title: "KakaoMap坐标打开器",
          description: "在KakaoMap中打开坐标",
          page: {
            description: "输入经纬度并在KakaoMap中直接打开该坐标。",
            latitudeLabel: "纬度",
            longitudeLabel: "经度",
            openButton: "在KakaoMap中打开"
          }
        },
        llmVramCalculator: {
          title: "LLM VRAM计算器",
          description: "计算LLM的VRAM需求",
          errors: {
            enterModelId: "请输入模型ID。",
            unauthorized: "认证失败，请检查令牌权限。",
            forbidden: "无权访问该模型。",
            modelConfigNotFound: "未找到模型配置文件。",
            fetchConfigFailed: "获取模型配置失败:",
            incompleteConfig: "模型配置信息不完整。",
            fetchModelSizeManual: "无法自动获取模型大小，请手动输入。",
            fetchModelSizeError: "从API获取模型大小失败。",
            unknownFetchError: "获取模型信息时发生未知错误。",
            invalidModelSize: "模型大小无效。",
            invalidGGUFQuant: "权重量化值无效。",
            invalidContextLength: "上下文长度无效。",
            invalidKVQuant: "KV缓存量化值无效。",
            invalidOverhead: "额外开销值无效。",
            invalidHeadDimension: "模型配置中的头维度无效。"
          },
          page: {
            title: "LLM VRAM计算器（GGUF估算）",
            description: "估算包含模型权重、KV缓存、缓冲区和开销在内的VRAM占用。",
            alertTitleError: "错误",
            loading: "加载中...",
            loadModelInfo: "加载模型信息",
            labels: {
              modelId: "模型ID（Hugging Face）",
              hfToken: "HF令牌（可选）",
              modelSize: "模型大小（B参数）",
              batchSize: "批大小",
              contextLength: "上下文长度",
              quantWeight: "权重量化（GGUF）",
              quantKV: "KV缓存量化",
              overhead: "额外开销（GB）"
            },
            placeholders: {
              modelId: "例如：Qwen/Qwen3-0.6B",
              hfToken: "hf_xxx（可选）",
              modelSize: "例如：0.6",
              batchSize: "例如：512",
              quantWeight: "选择GGUF量化",
              quantKV: "选择KV缓存量化",
              overhead: "例如：0.5"
            },
            descriptions: {
              hfTokenHelp: "仅在受限/私有模型时需要令牌。",
              modelSize: "单位为B（十亿参数）。",
              modelSizeFailed: " 自动获取失败，请手动输入。",
              batchSize: "用于估算输入/计算缓冲区。",
              contextLength: "用于估算KV缓存大小。",
              quantWeight: "用于计算模型权重内存的每权重比特数。",
              quantKV: "用于计算KV缓存内存的比特宽度。",
              overhead: "运行时/系统额外开销（GB）。"
            },
            status: {
              fetched: "自动获取成功",
              fetchFailed: "自动获取失败",
              fetching: "获取中...",
              loadOrEnter: "加载或手动输入"
            },
            results: {
              title: "预计VRAM明细",
              modelWeights: "模型权重:",
              kvCache: "KV缓存:",
              inputBuffer: "输入缓冲区:",
              computeBuffer: "计算缓冲区:",
              overhead: "额外开销:",
              total: "预计总计:"
            },
            messages: {
              loadingData: "正在加载模型数据...",
              calculationFailedPrefix: "无法计算: ",
              startPrompt: "加载模型信息后开始估算。",
              validModelSizePrompt: "请输入有效的模型大小。",
              calculating: "计算中..."
            }
          }
        },
        ntripScanner: {
          title: "NTRIP扫描器",
          description: "扫描NTRIP广播器以查找可用流",
          page: {
            title: "NTRIP扫描器",
            casterIp: "Caster IP",
            port: "端口",
            id: "ID",
            password: "密码",
            hostPlaceholder: "例如：127.0.0.1",
            portPlaceholder: "例如：2101",
            scanStart: "开始扫描",
            scanning: "扫描中...",
            mountPointList: "挂载点列表",
            unknownError: "发生未知错误。",
            connectionFailed: "连接失败。"
          }
        },
        opticalPuyoReader: {
          title: "光学Puyo读取器",
          description: "从图像中读取Puyo游戏板",
          uploadTip: "上传Puyo棋盘截图。系统会自动识别6x12棋盘。",
          originalColors: "原始颜色",
          categorizedColors: "分类后颜色",
          row: "行",
          column: "列",
          empty: "空",
          colorSnapSensitivity: "颜色吸附灵敏度",
          chainSimulatorLink: "连锁模拟器",
          openInChainSimulator: "在连锁模拟器中打开"
        },
        videoCutterEncoder: {
          title: "视频剪切编码器",
          description: "剪切和编码视频片段",
          page: {
            selectVideo: "选择视频",
            chooseVideoFile: "选择视频文件",
            selected: "已选择",
            originalVideo: "原始视频",
            trimRange: "剪切范围",
            start: "开始",
            end: "结束",
            enableSizeLimit: "启用大小限制",
            selectSizeLimit: "选择大小限制",
            custom: "自定义",
            processing: "处理中...",
            process: "处理",
            trimmedVideo: "剪切后的视频",
            downloadTrimmedVideo: "下载剪切后的视频",
            fixVideoReEncode: "修复视频（重新编码）",
            lowQualitySmallSize: "低质量（小尺寸）",
            formatRequiresReencoding: "此格式需要重新编码",
            sizeLimitRequiresReencoding: "大小限制需要重新编码。禁用以快速处理。",
            processFastTrim: "将快速剪切而不重新编码。如果视频有问题，请使用修复选项。",
            formatRequiresReencodingLonger: "此格式需要重新编码。处理可能需要更长时间。",
            loadingFFmpeg: "正在加载FFmpeg核心...",
            ffmpegLoaded: "FFmpeg加载成功！",
            ffmpegNotLoaded: "FFmpeg模块尚未加载...",
            writingFile: "正在将文件写入FFmpeg...",
            fileTooBig: "文件太大，无法在浏览器中处理。最大大小为2GB。",
            trimmingFast: "正在剪切视频（快速模式）...",
            trimmingPrecise: "正在剪切视频（精确模式）...",
            trimmingLowQuality: "正在剪切视频（低质量模式）...",
            invalidSizeLimit: "无效的大小限制。必须至少为1MB。",
            targetSizeTooSmall: "目标大小对于所选时长太小。请选择更大的大小或更短的时长。",
            targetSizeSmaller: "目标大小小于预估。正在重新编码...",
            targetSizeLarger: "目标大小大于预估。使用精确剪切以保持质量...",
            readingResult: "正在读取结果...",
            done: "完成！",
            memoryError: "内存错误：请尝试使用较小的视频片段或降低质量设置。",
            errorProcessing: "视频处理错误",
            selectedFile: "已选择文件",
            current: "当前",
            limitOutputFileSize: "限制输出文件大小",
            mbPlaceholder: "MB",
            fixHighQuality: "修复视频（高质量）",
            fixLowQuality: "修复视频（低质量）",
            largeFileWarning: "大文件可能需要更长处理时间。",
            errorOccurred: "发生错误。"
          }
        },
        tetrioReplayEditor: {
          title: "Tetrio回放编辑器",
          description: "编辑Tetrio回放文件"
        },
        qrCode: {
          title: "二维码",
          description: "生成和读取二维码",
          placeholder: "输入文本以生成二维码",
          tabGenerate: "生成",
          tabRead: "读取",
          generateTitle: "生成二维码",
          readTitle: "读取二维码",
          pasteFromClipboard: "从剪贴板粘贴 (Ctrl+V)",
          orUploadFile: "或上传二维码图片",
          uploadFile: "上传图片",
          decodedResult: "识别结果",
          copyResult: "复制",
          copied: "已复制！",
          noQrFound: "在图片中未找到二维码。",
          pasteHint: "按Ctrl+V粘贴剪贴板中的二维码图片",
          dragDropHint: "或将图片拖放到此处",
          downloadQr: "下载二维码",
          previewAlt: "生成的二维码预览"
        }
      }
    }
  }
};

export type Language = keyof typeof translations;
export type TranslationKeys = typeof translations.en;
