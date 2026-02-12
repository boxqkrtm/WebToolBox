export const translations = {
  en: {
    common: {
      title: "Web Utils",
      subtitle: "A collection of useful tools and utilities.",
      backToCategories: "Back to Categories",
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
        discord: {
          title: "Discord",
          description: "Utilities for Discord."
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
          description: "Decode escaped strings"
        },
        xlsxToSql: {
          title: "XLSX to SQL",
          description: "Convert Excel files to SQL statements"
        },
        csvSorter: {
          title: "CSV Sorter",
          description: "Sort CSV data by columns"
        },
        boothAlgorithmMultiplier: {
          title: "Booth Algorithm Multiplier",
          description: "Binary multiplication using Booth's algorithm"
        },
        discordColorMessageGenerator: {
          title: "Discord Color Message Generator",
          description: "Generate colored messages for Discord",
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
          description: "Convert images to Base64 format"
        },
        kakaomapCoordOpener: {
          title: "KakaoMap Coord Opener",
          description: "Open coordinates in KakaoMap"
        },
        llmVramCalculator: {
          title: "LLM VRAM Calculator",
          description: "Calculate VRAM requirements for LLMs"
        },
        ntripScanner: {
          title: "NTRIP Scanner",
          description: "Scan NTRIP casters for available streams"
        },
        opticalPuyoReader: {
          title: "Optical Puyo Reader",
          description: "Read Puyo game board from images"
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
            errorProcessing: "Error processing video"
          }
        },
        tetrioReplayEditor: {
          title: "Tetrio Replay Editor",
          description: "Edit Tetrio replay files"
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
          downloadQr: "Download QR Code"
        }
      }
    }
  },
  ko: {
    common: {
      title: "웹 유틸리티",
      subtitle: "유용한 도구 및 유틸리티 모음",
      backToCategories: "카테고리로 돌아가기",
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
        discord: {
          title: "디스코드",
          description: "디스코드 유틸리티"
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
          description: "이스케이프된 문자열 디코딩"
        },
        xlsxToSql: {
          title: "XLSX → SQL",
          description: "엑셀 파일을 SQL 문으로 변환"
        },
        csvSorter: {
          title: "CSV 정렬기",
          description: "CSV 데이터를 열 기준으로 정렬"
        },
        boothAlgorithmMultiplier: {
          title: "부스 알고리즘 곱셈기",
          description: "부스 알고리즘을 사용한 이진 곱셈"
        },
        discordColorMessageGenerator: {
          title: "디스코드 컬러 메시지 생성기",
          description: "디스코드용 컬러 메시지 생성",
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
          description: "이미지를 Base64 형식으로 변환"
        },
        kakaomapCoordOpener: {
          title: "카카오맵 좌표 열기",
          description: "카카오맵에서 좌표 열기"
        },
        llmVramCalculator: {
          title: "LLM VRAM 계산기",
          description: "LLM의 VRAM 요구사항 계산"
        },
        ntripScanner: {
          title: "NTRIP 스캐너",
          description: "NTRIP 캐스터에서 사용 가능한 스트림 검색"
        },
        opticalPuyoReader: {
          title: "광학 뿌요 리더",
          description: "이미지에서 뿌요 게임 보드 읽기"
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
            errorProcessing: "비디오 처리 오류"
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
          downloadQr: "QR코드 다운로드"
        }
      }
    }
  },
  ja: {
    common: {
      title: "ウェブユーティリティ",
      subtitle: "便利なツールとユーティリティのコレクション",
      backToCategories: "カテゴリーに戻る",
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
        discord: {
          title: "Discord",
          description: "Discord用ユーティリティ"
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
          description: "エスケープされた文字列をデコード"
        },
        xlsxToSql: {
          title: "XLSX → SQL",
          description: "ExcelファイルをSQL文に変換"
        },
        csvSorter: {
          title: "CSVソーター",
          description: "CSVデータを列でソート"
        },
        boothAlgorithmMultiplier: {
          title: "ブースアルゴリズム乗算器",
          description: "ブースアルゴリズムを使用したバイナリ乗算"
        },
        discordColorMessageGenerator: {
          title: "Discord カラーメッセージジェネレーター",
          description: "Discord用のカラーメッセージを生成",
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
          description: "画像をBase64形式に変換"
        },
        kakaomapCoordOpener: {
          title: "カカオマップ座標オープナー",
          description: "カカオマップで座標を開く"
        },
        llmVramCalculator: {
          title: "LLM VRAM計算機",
          description: "LLMのVRAM要件を計算"
        },
        ntripScanner: {
          title: "NTRIPスキャナー",
          description: "NTRIPキャスターで利用可能なストリームを検索"
        },
        opticalPuyoReader: {
          title: "光学ぷよぷよリーダー",
          description: "画像からぷよぷよゲームボードを読み取る"
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
            errorProcessing: "ビデオ処理エラー"
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
          downloadQr: "QRコードをダウンロード"
        }
      }
    }
  },
  zh: {
    common: {
      title: "网页工具",
      subtitle: "实用工具和实用程序集合",
      backToCategories: "返回分类",
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
        discord: {
          title: "Discord",
          description: "Discord实用工具"
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
          description: "解码转义字符串"
        },
        xlsxToSql: {
          title: "XLSX 转 SQL",
          description: "将Excel文件转换为SQL语句"
        },
        csvSorter: {
          title: "CSV排序器",
          description: "按列排序CSV数据"
        },
        boothAlgorithmMultiplier: {
          title: "Booth算法乘法器",
          description: "使用Booth算法进行二进制乘法"
        },
        discordColorMessageGenerator: {
          title: "Discord彩色消息生成器",
          description: "为Discord生成彩色消息",
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
          description: "将图片转换为Base64格式"
        },
        kakaomapCoordOpener: {
          title: "KakaoMap坐标打开器",
          description: "在KakaoMap中打开坐标"
        },
        llmVramCalculator: {
          title: "LLM VRAM计算器",
          description: "计算LLM的VRAM需求"
        },
        ntripScanner: {
          title: "NTRIP扫描器",
          description: "扫描NTRIP广播器以查找可用流"
        },
        opticalPuyoReader: {
          title: "光学Puyo读取器",
          description: "从图像中读取Puyo游戏板"
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
            errorProcessing: "视频处理错误"
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
          downloadQr: "下载二维码"
        }
      }
    }
  }
};

export type Language = keyof typeof translations;
export type TranslationKeys = typeof translations.en;