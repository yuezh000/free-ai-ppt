pub const FREE_SLIDES_PER_ACCOUNT: i64 = 10;
pub const MAX_SLIDES_PER_JOB: i64 = 100;

const PAGE_WORDS: [&str; 18] = [
    "slides", "slide", "pages", "page", "幻灯片", "投影片", "页", "頁", "张", "張",
    "ページ", "슬라이드", "장", "diapositives", "diapositivas", "diapositive", "diapositiva", "слайд",
];

pub fn infer_slide_count(prompt: &str) -> i64 {
    let lower = prompt.to_lowercase();
    for (start, character) in lower.char_indices() {
        if !character.is_ascii_digit() || lower[..start].chars().last().is_some_and(|c| c.is_ascii_digit()) {
            continue;
        }
        let digits = lower[start..]
            .chars()
            .take_while(|c| c.is_ascii_digit())
            .collect::<String>();
        let Some(count) = digits.parse::<i64>().ok() else {
            continue;
        };
        let before = lower[..start].chars().rev().take(18).collect::<Vec<_>>().into_iter().rev().collect::<String>();
        let after = lower[start + digits.len()..].chars().take(18).collect::<String>();
        let before = before.trim_end_matches(|c: char| matches!(c, ' ' | ':' | '-' | '–' | '—'));
        let after = after.trim_start_matches(|c: char| matches!(c, ' ' | ':' | '-' | '–' | '—'));
        if PAGE_WORDS.iter().any(|word| before.ends_with(word) || after.starts_with(word)) {
            return count;
        }
    }
    for (text, count) in [
        ("二十", 20), ("十九", 19), ("十八", 18), ("十七", 17), ("十六", 16),
        ("十五", 15), ("十四", 14), ("十三", 13), ("十二", 12), ("十一", 11),
        ("十", 10), ("九", 9), ("八", 8), ("七", 7), ("六", 6), ("五", 5),
        ("四", 4), ("三", 3), ("二", 2), ("一", 1),
    ] {
        if ["页", "頁", "张", "張"].iter().any(|unit| lower.contains(&format!("{text}{unit}"))) {
            return count;
        }
    }
    let characters = prompt.chars().count();
    let words = prompt.split_whitespace().count();
    let sections = prompt.lines().filter(|line| !line.trim().is_empty()).count();
    if characters >= 700 || words >= 120 || sections >= 7 {
        10
    } else if characters >= 250 || words >= 45 || sections >= 4 {
        8
    } else {
        6
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn infers_explicit_counts_and_scales_unspecified_briefs() {
        assert_eq!(infer_slide_count("Create a 6-slide business deck"), 6);
        assert_eq!(infer_slide_count("请制作十二页的路演材料"), 12);
        assert_eq!(infer_slide_count("做5张PPT"), 5);
        assert_eq!(infer_slide_count("Summarize the strategy"), 6);
        assert_eq!(infer_slide_count(&"Project goals, evidence, risks, and next steps. ".repeat(12)), 8);
        assert_eq!(infer_slide_count(&"Project goals, evidence, risks, and next steps. ".repeat(20)), 10);
    }
}
